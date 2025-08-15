'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  role: 'SUPERADMIN' | 'ADMIN' | 'ORGANIZER' | 'JUDGE' | 'MENTOR' | 'PARTICIPANT'
  bio?: string
  location?: string
  skills?: string[]
  walletAddress?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Permission mapping
  const rolePermissions = {
    SUPERADMIN: [
      'manage_users',
      'manage_hackathons',
      'manage_projects',
      'manage_organizations',
      'manage_system',
      'view_analytics',
      'delete_data'
    ],
    ADMIN: [
      'manage_hackathons',
      'manage_projects',
      'manage_organizations',
      'view_analytics'
    ],
    ORGANIZER: [
      'create_hackathons',
      'manage_own_hackathons',
      'view_hackathon_analytics',
      'manage_projects_in_own_hackathons'
    ],
    JUDGE: [
      'view_assigned_projects',
      'submit_evaluations',
      'view_hackathon_details'
    ],
    MENTOR: [
      'view_hackathon_details',
      'provide_feedback',
      'mentor_participants'
    ],
    PARTICIPANT: [
      'view_hackathons',
      'register_for_hackathons',
      'create_teams',
      'submit_projects',
      'comment_on_projects'
    ]
  }

  useEffect(() => {
    // Check if user is logged in on page load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // In a real app, you would validate the token with the backend
          // For now, we'll simulate it
          const userData = localStorage.getItem('user_data')
          if (userData) {
            setUser(JSON.parse(userData))
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        
        // Store auth data (in a real app, you'd store JWT tokens)
        localStorage.setItem('auth_token', 'mock_token')
        localStorage.setItem('user_data', JSON.stringify(data.user))
        
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    const userPermissions = rolePermissions[user.role] || []
    return userPermissions.includes(permission)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Permission components for conditional rendering
export function RequirePermission({ 
  permission, 
  children, 
  fallback = null 
}: { 
  permission: string
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const { hasPermission } = useAuth()
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

export function RequireRole({ 
  roles, 
  children, 
  fallback = null 
}: { 
  roles: string[]
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const { user } = useAuth()
  
  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}