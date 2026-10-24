import { createContext, useContext, useState, useEffect } from "react"
import api from "../api/axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    verificarToken()
  }, [])

  const verificarToken = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const res = await api.get("/api/auth/verify")
        setUser(res.data.user)
      } catch {
        localStorage.removeItem("token")
        setUser(null)
      }
    }
    setLoading(false)
  }

  const login = async (username, password) => {
    const res = await api.post("/api/auth/login", { username, password })
    localStorage.setItem("token", res.data.token)
    setUser(res.data.user)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext