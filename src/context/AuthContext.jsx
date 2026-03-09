import { createContext, useContext, useState } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cb_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { token, user: u } = res.data
    localStorage.setItem('cb_token', token)
    localStorage.setItem('cb_user', JSON.stringify(u))
    setUser(u)
    return u
  }

  const register = async (formData) => {
    const res = await authAPI.register(formData)
    const { token, user: u } = res.data
    localStorage.setItem('cb_token', token)
    localStorage.setItem('cb_user', JSON.stringify(u))
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('cb_token')
    localStorage.removeItem('cb_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isBuilder: user?.role === 'builder',
        isConsultant: user?.role === 'consultant',
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
