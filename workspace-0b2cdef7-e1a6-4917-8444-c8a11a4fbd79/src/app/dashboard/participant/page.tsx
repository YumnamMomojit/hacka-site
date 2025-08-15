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
  Github,
  ExternalLink,
  Plus,
  Search,
  Filter
} from "lucide-react"
import Link from "next/link"

interface ParticipantStats {
  hackathonsParticipated: number
  projectsSubmitted: number
  teamsJoined: number
  achievements: number
  upcomingHackathons: number
  activeProjects: number
}

interface RegisteredHackathon {
  id: string
  title: string
  status: string
  startDate: string
  endDate: string
  location: string
  prizePool: number
  participants: number
  maxParticipants: number
}

interface Team {
  id: string
  name: string
  hackathon: string
  role: string
  members: number
  maxMembers: number
  project?: {
    title: string
    status: string
    submittedAt: string
  }
}

export default function ParticipantDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<ParticipantStats>({
    hackathonsParticipated: 0,
    projectsSubmitted: 0,
    teamsJoined: 0,
    achievements: 0,
    upcomingHackathons: 0,
    activeProjects: 0
  })
  const [registeredHackathons, setRegisteredHackathons] = useState<RegisteredHackathon[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching participant data
    const fetchParticipantData = async () => {
      setTimeout(() => {
        setStats({
          hackathonsParticipated: 3,
          projectsSubmitted: 2,
          teamsJoined: 2,
          achievements: 5,
          upcomingHackathons: 2,
          activeProjects: 1
        })

        setRegisteredHackathons([
          {
            id: '1',
            title: 'DeFi Innovation Challenge',
            status: 'ONGOING',
            startDate: '2024-03-15',
            endDate: '2024-03-17',
            location: 'Virtual',
            prizePool: 50000,
            participants: 234,
            maxParticipants: 500
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
            maxParticipants: 300
          }
        ])

        setTeams([
          {
            id: '1',
            name: 'Team Alpha',
            hackathon: 'DeFi Innovation Challenge',
            role: 'LEADER',
            members: 3,
            maxMembers: 4,
            project: {
              title: 'Yield Optimizer Pro',
              status: 'SUBMITTED',
              submittedAt: '2024-03-16'
            }
          },
          {
            id: '2',
            name: 'Web3 Innovators',
            hackathon: 'AI & Web3 Integration',
            role: 'MEMBER',
            members: 2,
            maxMembers: 4
          }
        ])
        setLoading(false)
      }, 1000)
    }

    fetchParticipantData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONGOING':
        return 'bg-green-500'
      case 'UPCOMING':
        return 'bg-blue-500'
      case 'COMPLETED':
        return 'bg-gray-500'
      case 'SUBMITTED':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
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
    <RequireRole roles={['PARTICIPANT']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">Participant Dashboard</h1>
                <Badge className="bg-blue-500">Participant</Badge>
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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="hackathons">My Hackathons</TabsTrigger>
              <TabsTrigger value="teams">My Teams</TabsTrigger>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hackathons</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.hackathonsParticipated}</div>
                    <p className="text-xs text-muted-foreground">
                      Participated
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projects</CardTitle>
                    <Code className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.projectsSubmitted}</div>
                    <p className="text-xs text-muted-foreground">
                      Submitted
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Teams</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.teamsJoined}</div>
                    <p className="text-xs text-muted-foreground">
                      Joined
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.achievements}</div>
                    <p className="text-xs text-muted-foreground">
                      Earned
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.upcomingHackathons}</div>
                    <p className="text-xs text-muted-foreground">
                      Hackathons
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeProjects}</div>
                    <p className="text-xs text-muted-foreground">
                      Projects
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Hackathons & Teams */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Upcoming Hackathons</CardTitle>
                        <CardDescription>Hackathons you're registered for</CardDescription>
                      </div>
                      <Button size="sm" asChild>
                        <Link href="/hackathons">
                          <Search className="mr-2 h-4 w-4" />
                          Browse
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {registeredHackathons.map((hackathon) => (
                        <div key={hackathon.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold">{hackathon.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getStatusColor(hackathon.status)}>
                                {hackathon.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span>{hackathon.location}</span>
                              <span>•</span>
                              <span>${hackathon.prizePool.toLocaleString()} prize pool</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/hackathons/${hackathon.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>My Teams</CardTitle>
                        <CardDescription>Teams you're a member of</CardDescription>
                      </div>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Team
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teams.map((team) => (
                        <div key={team.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold">{team.name}</h3>
                            <p className="text-sm text-muted-foreground">{team.hackathon}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">{team.role}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {team.members}/{team.maxMembers} members
                              </span>
                            </div>
                            {team.project && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">{team.project.title}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge className={getStatusColor(team.project.status)}>
                                    {team.project.status}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Submitted {formatDate(team.project.submittedAt)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
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
                  <CardTitle>My Hackathons</CardTitle>
                  <CardDescription>All hackathons you've participated in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registeredHackathons.map((hackathon) => (
                      <div key={hackathon.id} className="flex items-center justify-between p-6 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{hackathon.title}</h3>
                            <Badge className={getStatusColor(hackathon.status)}>
                              {hackathon.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                            <span>•</span>
                            <span>{hackathon.location}</span>
                            <span>•</span>
                            <span>${hackathon.prizePool.toLocaleString()} prize pool</span>
                          </div>
                          <div className="mt-3">
                            <Progress value={(hackathon.participants / hackathon.maxParticipants) * 100} className="w-48" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {hackathon.participants}/{hackathon.maxParticipants} participants
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" asChild>
                            <Link href={`/hackathons/${hackathon.id}`}>
                              View Details
                            </Link>
                          </Button>
                          {hackathon.status === 'ONGOING' && (
                            <Button asChild>
                              <Link href={`/hackathons/${hackathon.id}/submit`}>
                                Submit Project
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Teams</CardTitle>
                      <CardDescription>Manage your team memberships and collaborations</CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Team
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teams.map((team) => (
                      <div key={team.id} className="p-6 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{team.name}</h3>
                            <p className="text-sm text-muted-foreground">{team.hackathon}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{team.role}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {team.members}/{team.maxMembers} members
                            </span>
                          </div>
                        </div>
                        
                        {team.project ? (
                          <div className="mt-4 p-4 bg-muted rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{team.project.title}</h4>
                              <Badge className={getStatusColor(team.project.status)}>
                                {team.project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Submitted on {formatDate(team.project.submittedAt)}
                            </p>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/projects/${team.project.id}`}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Project
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/projects/${team.project.id}/edit`}>
                                  Edit Project
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                              No project submitted yet
                            </p>
                            <Button size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Submit Project
                            </Button>
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Users className="mr-2 h-4 w-4" />
                              Manage Members
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Team Chat
                            </Button>
                          </div>
                          <Button variant="outline" size="sm">
                            Leave Team
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
                      <CardTitle>My Projects</CardTitle>
                      <CardDescription>Projects you've submitted or are working on</CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teams.filter(t => t.project).map((team) => (
                      <Card key={team.project?.title}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{team.project?.title}</CardTitle>
                            <Badge className={getStatusColor(team.project?.status || '')}>
                              {team.project?.status}
                            </Badge>
                          </div>
                          <CardDescription>
                            {team.hackathon} • {team.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Submitted</span>
                              <span>{formatDate(team.project?.submittedAt || '')}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Team</span>
                              <span>{team.name}</span>
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button variant="outline" size="sm" className="flex-1" asChild>
                                <Link href={`/projects/${team.project?.id}`}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1" asChild>
                                <Link href={`/projects/${team.project?.id}/edit`}>
                                  Edit
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Badges</CardTitle>
                  <CardDescription>Your accomplishments and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: 'First Steps', description: 'Joined your first hackathon', icon: '🎯', earned: true },
                      { title: 'Team Player', description: 'Joined a team', icon: '👥', earned: true },
                      { title: 'Project Creator', description: 'Submitted your first project', icon: '💡', earned: true },
                      { title: 'Social Butterfly', description: 'Commented on 10+ projects', icon: '🦋', earned: true },
                      { title: 'Hackathon Veteran', description: 'Participated in 5+ hackathons', icon: '🏆', earned: false },
                      { title: 'Top Contributor', description: 'Top 10% contributor', icon: '⭐', earned: false },
                    ].map((achievement, index) => (
                      <Card key={index} className={achievement.earned ? '' : 'opacity-50'}>
                        <CardHeader className="text-center">
                          <div className="text-4xl mb-2">{achievement.icon}</div>
                          <CardTitle className="text-lg">{achievement.title}</CardTitle>
                          <CardDescription>{achievement.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                          {achievement.earned ? (
                            <Badge className="bg-green-500">Earned</Badge>
                          ) : (
                            <Badge variant="outline">Locked</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
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