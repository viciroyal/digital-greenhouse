import { useAuth, useUser } from '@clerk/react'
import { createContext, ReactNode, useContext } from 'react'

interface AuthContextType {
  isLoaded: boolean
  isSignedIn: boolean | null
  user: any
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, signOut } = useAuth()
  const { user } = useUser()

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}