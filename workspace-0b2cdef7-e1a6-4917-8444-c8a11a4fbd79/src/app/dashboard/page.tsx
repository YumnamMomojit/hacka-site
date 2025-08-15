'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/')
        return
      }

      // Redirect based on user role
      switch (user?.role) {
        case 'SUPERADMIN':
        case 'ADMIN':
          // Admins see the main dashboard
          break
        case 'ORGANIZER':
          router.push('/dashboard/organizer')
          break
        case 'PARTICIPANT':
          router.push('/dashboard/participant')
          break
        case 'JUDGE':
          router.push('/dashboard/judge')
          break
        case 'MENTOR':
          router.push('/dashboard/mentor')
          break
        default:
          router.push('/')
      }
    }
  }, [user, loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Only show this page for SUPERADMIN and ADMIN roles
  if (!user || !['SUPERADMIN', 'ADMIN'].includes(user.role)) {
    return null // Will redirect in useEffect
  }

  // Original superadmin dashboard content
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Badge className="bg-red-500">Super Administrator</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  localStorage.removeItem('auth_token')
                  localStorage.removeItem('user_data')
                  window.location.reload()
                }}
                className="px-4 py-2 border border-border rounded-md hover:bg-accent"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">System Overview</h3>
            <p className="text-muted-foreground mb-4">Monitor and manage the entire platform</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Users</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span>Active Hackathons</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between">
                <span>Total Projects</span>
                <span className="font-semibold">156</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 hover:bg-accent rounded">
                Manage Users
              </button>
              <button className="w-full text-left p-2 hover:bg-accent rounded">
                Create Hackathon
              </button>
              <button className="w-full text-left p-2 hover:bg-accent rounded">
                View Analytics
              </button>
              <button className="w-full text-left p-2 hover:bg-accent rounded">
                System Settings
              </button>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-muted rounded">
                <p>New user registered</p>
                <p className="text-muted-foreground">2 minutes ago</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p>Project submitted</p>
                <p className="text-muted-foreground">1 hour ago</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p>Hackathon created</p>
                <p className="text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">System Health</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Server Status</span>
                <span className="text-green-600">● Online</span>
              </div>
              <div className="flex justify-between">
                <span>Database</span>
                <span className="text-green-600">● Connected</span>
              </div>
              <div className="flex justify-between">
                <span>API Response</span>
                <span className="text-green-600">● Normal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}