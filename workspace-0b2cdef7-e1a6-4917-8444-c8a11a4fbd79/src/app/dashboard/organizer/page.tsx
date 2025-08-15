'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { RequireRole } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Trophy, 
  Users, 
  Code, 
  MessageSquare,
  Clock,
  TrendingUp,
  Star,
  Plus,
  Edit,
  Eye,
  Settings,
  BarChart3,
  Filter,
  Search,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  Pause,
  Play
} from "lucide-react"
import Link from "next/link"

interface OrganizerStats {
  totalHackathons: number
  activeHackathons: number
  totalParticipants: number
  totalProjects: number
  totalPrizePool: number
  upcomingEvents: number
}

interface Hackathon {
  id: string
  title: string
  status: string
  startDate: string
  endDate: string
  location: string
  prizePool: number
  participants: number
  maxParticipants: number
  projects: number
  description: string
}

interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  hackathonsParticipated: number
  projectsSubmitted: number
  joinedAt: string
}

export default function OrganizerDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<OrganizerStats>({
    totalHackathons: 0,
    activeHackathons: 0,
    totalParticipants: 0,
    totalProjects: 0,
    totalPrizePool: 0,
    upcomingEvents: 0
  })
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching organizer data
    const fetchOrganizerData = async () => {
      setTimeout(() => {
        setStats({
          totalHackathons: 5,
          activeHackathons: 2,
          totalParticipants: 1247,
          totalProjects: 156,
          totalPrizePool: 275000,
          upcomingEvents: 1
        })

        setHackathons([
          {
            id: '1',
            title: 'DeFi Innovation Challenge',
            status: 'ONGOING',
            startDate: '2024-03-15',
            endDate: '2024-03-17',
            location: 'Virtual',
            prizePool: 50000,
            participants: 234,
            maxParticipants: 500,
            projects: 12,
            description: 'Build innovative DeFi solutions'
          },
          {
            id: '2',
            title: 'AI & Web3 Integration',
            status: 'UPCOMING',
            startDate: '2024-04-01',
            endDate: '2024-04-03',
            location: 'San Francisco',
            prizePool: 75000,
            participants: 156,
            maxParticipants: 300,
            projects: 0,
            description: 'Merge AI with blockchain technology'
          },
          {
            id: '3',
            title: 'Gaming & Metaverse',
            status: 'UPCOMING',
            startDate: '2024-04-20',
            endDate: '2024-04-22',
            location: 'Virtual',
            prizePool: 100000,
            participants: 89,
            maxParticipants: 400,
            projects: 0,
            description: 'Build immersive gaming experiences'
          }
        ])

        setParticipants([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            hackathonsParticipated: 3,
            projectsSubmitted: 2,
            joinedAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            hackathonsParticipated: 2,
            projectsSubmitted: 1,
            joinedAt: '2024-02-01'
          },
          {
            id: '3',
            name: 'Bob Smith',
            email: 'bob@example.com',
            hackathonsParticipated: 4,
            projectsSubmitted: 3,
            joinedAt: '2024-01-20'
          }
        ])
        setLoading(false)
      }, 1000)
    }

    fetchOrganizerData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return 'bg-green-500'
      case 'UPCOMING':
        return 'bg-blue-500'
      case 'COMPLETED':
        return 'bg-gray-500'
      case 'DRAFT':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return <Play className="h-4 w-4" />
      case 'UPCOMING':
        return <Clock className="h-4 w-4" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'DRAFT':
        return <Edit className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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

  return (
    <RequireRole roles={['ORGANIZER', 'ADMIN', 'SUPERADMIN']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
                <Badge className="bg-blue-500">Organizer</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="hackathons">My Hackathons</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalHackathons}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeHackathons} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Participants</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalParticipants.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Total across all events
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projects</CardTitle>
                    <Code className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProjects}</div>
                    <p className="text-xs text-muted-foreground">
                      Total submissions
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Prize Pool</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${(stats.totalPrizePool / 1000).toFixed(0)}K</div>
                    <p className="text-xs text-muted-foreground">
                      Total prize money
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                    <p className="text-xs text-muted-foreground">
                      Events scheduled
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <p className="text-xs text-muted-foreground">
                      Event completion
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Hackathons & Recent Participants */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Active Hackathons</CardTitle>
                        <CardDescription>Events currently running or upcoming</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hackathons.filter(h => h.status !== 'COMPLETED').map((hackathon) => (
                        <div key={hackathon.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{hackathon.title}</h3>
                              <Badge className={getStatusColor(hackathon.status)}>
                                {hackathon.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{hackathon.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                              <span>•</span>
                              <span>{hackathon.location}</span>
                            </div>
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Registration Progress</span>
                                <span>{hackathon.participants}/{hackathon.maxParticipants}</span>
                              </div>
                              <Progress value={(hackathon.participants / hackathon.maxParticipants) * 100} className="w-full" />
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hackathons/${hackathon.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hackathons/${hackathon.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Participants</CardTitle>
                        <CardDescription>Latest participants across your events</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {participants.map((participant) => (
                        <div key={participant.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-semibold">{participant.name}</h3>
                            <p className="text-sm text-muted-foreground">{participant.email}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span>{participant.hackathonsParticipated} hackathons</span>
                              <span>•</span>
                              <span>{participant.projectsSubmitted} projects</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Joined</p>
                            <p className="text-sm">{formatDate(participant.joinedAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hackathons">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Hackathons</CardTitle>
                      <CardDescription>Manage all your hackathon events</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Hackathon
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hackathons.map((hackathon) => (
                      <div key={hackathon.id} className="p-6 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(hackathon.status)}
                              <h3 className="text-lg font-semibold">{hackathon.title}</h3>
                            </div>
                            <Badge className={getStatusColor(hackathon.status)}>
                              {hackathon.status}
                            </Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hackathons/${hackathon.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/hackathons/${hackathon.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm">
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analytics
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{hackathon.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{formatDate(hackathon.startDate)}</div>
                            <div className="text-sm text-muted-foreground">Start Date</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{formatDate(hackathon.endDate)}</div>
                            <div className="text-sm text-muted-foreground">End Date</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">${hackathon.prizePool.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Prize Pool</div>
                          </div>
                          <div className="text-center p-3 bg-muted rounded-lg">
                            <div className="text-2xl font-bold">{hackathon.participants}/{hackathon.maxParticipants}</div>
                            <div className="text-sm text-muted-foreground">Participants</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{hackathon.location}</span>
                              <span>•</span>
                              <span>{hackathon.projects} projects submitted</span>
                            </div>
                            <div className="flex space-x-2">
                              {hackathon.status === 'DRAFT' && (
                                <Button size="sm">
                                  <Play className="mr-2 h-4 w-4" />
                                  Publish
                                </Button>
                              )}
                              {hackathon.status === 'ONGOING' && (
                                <Button size="sm" variant="outline">
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Participants Management</CardTitle>
                      <CardDescription>Manage participants across all your hackathons</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>
                              {participant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{participant.name}</h3>
                            <p className="text-sm text-muted-foreground">{participant.email}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                              <span>{participant.hackathonsParticipated} hackathons</span>
                              <span>•</span>
                              <span>{participant.projectsSubmitted} projects</span>
                              <span>•</span>
                              <span>Joined {formatDate(participant.joinedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project Submissions</CardTitle>
                      <CardDescription>Review and manage all project submissions</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Code className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Project Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Review, evaluate, and manage all project submissions from your hackathons
                    </p>
                    <Button>View All Projects</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>Detailed analytics and insights for your hackathons</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground mb-4">
                      View detailed analytics, participant engagement, and generate reports
                    </p>
                    <Button>View Analytics</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Organizer Settings</CardTitle>
                  <CardDescription>Configure your organizer profile and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Settings</h3>
                    <p className="text-muted-foreground mb-4">
                      Manage your organizer profile, notification preferences, and integration settings
                    </p>
                    <Button>Configure Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireRole>
  )
}