import {createContext. useContext, useState, ReactNode } from "react"

type UserRole = "admin" | "caretaker" | "family" | null

interface AuthContextType {
  role: userRole
  loginAs: (role: userRole) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider ({ children }: {children: ReactNode}) {
  const [role, setRole] = useState<userRole>(null)

  const loginAs = (newRole: userRole) => setRole(newRole)
  const logout = () => setRole(null)

  return (
    <AuthContext.Provider value = ({{ role, loginAs, logout, }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if(!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
