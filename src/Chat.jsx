import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Paper, Typography, TextField, IconButton,
  Avatar, Divider, CircularProgress, Alert, Chip, Button,
  Tooltip, Badge
} from '@mui/material';
import {
  Send, ArrowBack, AttachFile, Image as ImageIcon,
  FiberManualRecord, Close
} from '@mui/icons-material';
import { chatAPI, buildingAPI } from '../../services/api';
import { connectSocket, getSocket, disconnectSocket } from '../../services/socket';
import { useAuth } from '../../context/AuthContext';

const ChatBubble = ({ msg, isOwn }) => (
  <Box sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 1.5 }}>
    {!isOwn && (
      <Avatar sx={{ width: 30, height: 30, mr: 1, mt: 0.5, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
        {msg.sender_id?.name?.charAt(0) || '?'}
      </Avatar>
    )}
    <Box sx={{ maxWidth: '68%' }}>
      {!isOwn && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, mb: 0.25, display: 'block' }}>
          {msg.sender_id?.name}
          <Chip label={msg.sender_id?.role} size="small"
            sx={{ ml: 0.75, height: 16, fontSize: '0.65rem', bgcolor: msg.sender_id?.role === 'consultant' ? 'secondary.light' : 'primary.light', color: 'white' }} />
        </Typography>
      )}
      <Box sx={{
        bgcolor: isOwn ? 'primary.main' : 'background.paper',
        color: isOwn ? 'white' : 'text.primary',
        px: 2, py: 1.25,
        borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        border: isOwn ? 'none' : '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {msg.image_url && (
          <Box component="img" src={msg.image_url} alt="shared"
            sx={{ width: '100%', maxWidth: 280, borderRadius: 1.5, mb: msg.message_text ? 1 : 0, display: 'block', cursor: 'pointer' }}
            onClick={() => window.open(msg.image_url, '_blank')} />
        )}
        {msg.message_text && (
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{msg.message_text}</Typography>
        )}
      </Box>
      <Typography variant="caption" color="text.disabled"
        sx={{ mt: 0.25, display: 'block', textAlign: isOwn ? 'right' : 'left', px: 0.5 }}>
        {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Typography>
    </Box>
  </Box>
);

const Chat = () => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [building, setBuilding] = useState(null);
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState('');
  const [online, setOnline] = useState(false);

  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [msgRes, bldRes] = await Promise.all([
          chatAPI.getMessages(buildingId),
          buildingAPI.getById(buildingId)
        ]);
        setMessages(msgRes.data.messages);
        setBuilding(bldRes.data.building);
      } catch {
        setError('Failed to load chat.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [buildingId]);

  useEffect(() => {
    if (!building) return;
    const socket = connectSocket();

    socket.emit('join_room', { buildingId, userId: user.id, userName: user.name });
    setOnline(true);

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('user_typing', ({ userName }) => {
      if (userName !== user.name) setOtherTyping(`${userName} is typing…`);
    });

    socket.on('user_stop_typing', () => setOtherTyping(''));

    return () => {
      socket.emit('leave_room', { buildingId, userName: user.name });
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [building, buildingId, user]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleTyping = () => {
    const socket = getSocket();
    if (!typing) {
      setTyping(true);
      socket?.emit('typing', { buildingId, userName: user.name });
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setTyping(false);
      socket?.emit('stop_typing', { buildingId });
    }, 1500);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => { setImageFile(null); setImagePreview(null); };

  const handleSend = async () => {
    if (!text.trim() && !imageFile) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append('building_id', buildingId);
      if (text.trim()) fd.append('message_text', text.trim());
      if (imageFile) fd.append('image', imageFile);

      const res = await chatAPI.send(fd);
      const newMsg = res.data.data;

      // Emit via socket
      const socket = getSocket();
      socket?.emit('send_message', {
        buildingId,
        message: { ...newMsg, senderName: user.name }
      });

      setMessages(prev => [...prev, newMsg]);
      setText('');
      clearImage();
    } catch {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (loading) return <Box sx={{ textAlign: 'center', py: 12 }}><CircularProgress /></Box>;

  const otherParty = user.role === 'builder' ? building?.consultant_id : building?.builder_id;

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: 'grey.100' }}>
      {/* Chat header */}
      <Paper elevation={0} square sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'white' }}>
        <IconButton onClick={() => navigate(-1)} size="small"><ArrowBack /></IconButton>
        <Avatar sx={{ bgcolor: 'primary.main', width: 38, height: 38, fontWeight: 700, fontSize: 15 }}>
          {otherParty?.name?.charAt(0) || building?.building_name?.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={600} variant="body1">{building?.building_name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FiberManualRecord sx={{ fontSize: 10, color: online ? 'success.main' : 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {otherParty ? `with ${otherParty.name}` : 'Waiting for consultant…'}
            </Typography>
          </Box>
        </Box>
        <Button variant="outlined" size="small" onClick={() => navigate(`/buildings/${buildingId}`)}>
          View Building
        </Button>
      </Paper>

      {/* Messages area */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 4 }, py: 3, maxWidth: 860, width: '100%', mx: 'auto', alignSelf: 'stretch' }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>No messages yet</Typography>
            <Typography variant="body2" color="text.disabled">Start the conversation below.</Typography>
          </Box>
        ) : (
          messages.map((msg, i) => (
            <ChatBubble key={msg._id || i} msg={msg} isOwn={msg.sender_id?._id === user.id || msg.sender_id === user.id} />
          ))
        )}

        {otherTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="caption" color="text.disabled" fontStyle="italic">{otherTyping}</Typography>
          </Box>
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input area */}
      <Paper elevation={0} square sx={{ px: { xs: 2, md: 4 }, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white', maxWidth: 900, width: '100%', mx: 'auto', alignSelf: 'stretch' }}>
        {/* Image preview */}
        {imagePreview && (
          <Box sx={{ mb: 1.5, position: 'relative', display: 'inline-block' }}>
            <img src={imagePreview} alt="preview" style={{ height: 70, borderRadius: 8, border: '1px solid #ddd' }} />
            <IconButton size="small" onClick={clearImage}
              sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white', width: 20, height: 20, '&:hover': { bgcolor: 'error.dark' } }}>
              <Close sx={{ fontSize: 12 }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <Tooltip title="Attach image">
            <IconButton component="label" color="action" size="small">
              <ImageIcon />
              <input type="file" hidden accept="image/*" onChange={handleImageSelect} />
            </IconButton>
          </Tooltip>

          <TextField
            multiline maxRows={4} fullWidth
            placeholder="Type a message… (Enter to send)"
            value={text}
            onChange={e => { setText(e.target.value); handleTyping(); }}
            onKeyDown={handleKeyDown}
            variant="outlined" size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <IconButton
            onClick={handleSend}
            disabled={(!text.trim() && !imageFile) || sending}
            color="primary"
            sx={{ bgcolor: 'primary.main', color: 'white', width: 42, height: 42, flexShrink: 0,
              '&:hover': { bgcolor: 'primary.dark' }, '&:disabled': { bgcolor: 'action.disabledBackground' } }}
          >
            {sending ? <CircularProgress size={18} color="inherit" /> : <Send fontSize="small" />}
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.75, display: 'block', textAlign: 'center' }}>
          Press Enter to send • Shift+Enter for new line
        </Typography>
      </Paper>
    </Box>
  );
};

export default Chat;
