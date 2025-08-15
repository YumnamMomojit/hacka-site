'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MapPin, Users, Trophy, Clock, ExternalLink, Github, Twitter, Linkedin, Share2, Heart, MessageSquare } from "lucide-react"
import Link from "next/link"

interface Hackathon {
  id: string
  title: string
  description: string
  longDescription?: string
  bannerImage?: string
  logo?: string
  startDate: string
  endDate: string
  registrationStart: string
  registrationEnd: string
  location: string
  prizePool?: number
  status: string
  participants?: number
  maxParticipants?: number
  organizer?: {
    name: string
    logo?: string
    website?: string
    twitter?: string
    description?: string
  }
  tracks?: Array<{
    id: string
    name: string
    description: string
    prize: string
  }>
  judges?: Array<{
    id: string
    name: string
    title: string
    company: string
    avatar?: string
    bio: string
    twitter?: string
    linkedin?: string
    github?: string
  }>
  sponsors?: Array<{
    id: string
    name: string
    logo?: string
    website?: string
    tier: string
  }>
  timeline?: Array<{
    date: string
    title: string
    description: string
  }>
  prizes?: Array<{
    position: string
    amount: string
    description: string
    additional?: string
  }>
  rules?: string[]
  projects?: Array<{
    id: string
    title: string
    description: string
    author: string
    likes: number
    comments: number
    techStack?: string
  }>
}

export default function HackathonPage() {
  const params = useParams()
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [projects, setProjects] = useState<Hackathon['projects']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await fetch(`/api/hackathons/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch hackathon')
        }
        const data = await response.json()
        setHackathon(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/projects?hackathonId=${params.id}`)
        if (response.ok) {
          const data = await response.json()
          const formattedProjects = data.projects.map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            author: project.team.name,
            likes: project.likesCount,
            comments: project.commentsCount,
            techStack: project.techStack
          }))
          setProjects(formattedProjects)
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
      }
    }

    if (params.id) {
      fetchHackathon()
      fetchProjects()
    }
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REGISTRATION_OPEN":
        return "bg-green-500"
      case "UPCOMING":
        return "bg-blue-500"
      case "ONGOING":
        return "bg-orange-500"
      case "COMPLETED":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "REGISTRATION_OPEN":
        return "Registration Open"
      case "UPCOMING":
        return "Upcoming"
      case "ONGOING":
        return "Ongoing"
      case "COMPLETED":
        return "Completed"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleRegister = () => {
    setIsRegistered(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading hackathon...</p>
        </div>
      </div>
    )
  }

  if (error || !hackathon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Hackathon not found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The hackathon you are looking for does not exist.'}</p>
          <Link href="/hackathons">
            <Button>Back to Hackathons</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="aspect-video bg-muted">
          <img
            src={hackathon.bannerImage}
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={getStatusColor(hackathon.status)}>
                    {getStatusText(hackathon.status)}
                  </Badge>
                  {hackathon.status === 'ONGOING' && (
                    <Badge variant="destructive" className="bg-red-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathon.title}</h1>
                <p className="text-lg text-gray-200 mb-4 max-w-3xl">{hackathon.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {hackathon.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {hackathon.participants}/{hackathon.maxParticipants} participants
                  </div>
                  <div className="flex items-center font-semibold">
                    <Trophy className="w-4 h-4 mr-2" />
                    ${hackathon.prizePool?.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  size="lg" 
                  onClick={handleRegister}
                  disabled={isRegistered || hackathon.status !== 'REGISTRATION_OPEN'}
                  className="min-w-[150px]"
                >
                  {isRegistered ? 'Registered ✓' : 'Register Now'}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-white border-white/50 hover:bg-white/10">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="text-white border-white/50 hover:bg-white/10">
                    <Heart className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Organizer Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={hackathon.organizer.logo} />
                    <AvatarFallback>DA</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{hackathon.organizer.name}</h4>
                    <p className="text-sm text-muted-foreground">{hackathon.organizer.description}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={hackathon.organizer.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  {hackathon.organizer.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://twitter.com/${hackathon.organizer.twitter}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-semibold">Registration Closes</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(hackathon.registrationEnd)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Hackathon Starts</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(hackathon.startDate)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Hackathon Ends</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateTime(hackathon.endDate)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participants</span>
                  <span className="font-semibold">{hackathon.participants}/{hackathon.maxParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracks</span>
                  <span className="font-semibold">{hackathon.tracks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prize Pool</span>
                  <span className="font-semibold">${hackathon.prizePool?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Judges</span>
                  <span className="font-semibold">{hackathon.judges.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tracks">Tracks</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="prizes">Prizes</TabsTrigger>
                <TabsTrigger value="judges">Judges</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line">{hackathon.longDescription}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rules & Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {hackathon.rules.map((rule, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sponsors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {hackathon.sponsors.map((sponsor) => (
                        <div key={sponsor.id} className="flex flex-col items-center space-y-2">
                          <div className="w-full h-16 bg-muted rounded-lg flex items-center justify-center">
                            <img
                              src={sponsor.logo}
                              alt={sponsor.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-sm">{sponsor.name}</div>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {sponsor.tier}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tracks" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hackathon.tracks.map((track) => (
                    <Card key={track.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{track.name}</CardTitle>
                        <CardDescription>{track.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{track.prize}</div>
                          <div className="text-sm text-muted-foreground">Prize Pool</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <div className="space-y-4">
                  {hackathon.timeline.map((event, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <CalendarDays className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{event.title}</h3>
                              <Badge variant="outline">{formatDate(event.date)}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">{event.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="prizes" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hackathon.prizes.map((prize, index) => (
                    <Card key={index} className={index === 0 ? "border-primary" : ""}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {prize.position}
                          {index === 0 && <Trophy className="w-5 h-5 text-primary" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-primary">{prize.amount}</div>
                          <div className="text-sm text-muted-foreground">{prize.description}</div>
                        </div>
                        {prize.additional && (
                          <div className="text-center">
                            <Badge variant="secondary">{prize.additional}</Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="judges" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hackathon.judges.map((judge) => (
                    <Card key={judge.id}>
                      <CardHeader className="text-center">
                        <Avatar className="w-20 h-20 mx-auto mb-4">
                          <AvatarImage src={judge.avatar} />
                          <AvatarFallback>{judge.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">{judge.name}</CardTitle>
                        <CardDescription>{judge.title}</CardDescription>
                        <div className="text-sm text-muted-foreground">{judge.company}</div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{judge.bio}</p>
                        <div className="flex justify-center gap-2">
                          {judge.twitter && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://twitter.com/${judge.twitter}`} target="_blank" rel="noopener noreferrer">
                                <Twitter className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {judge.linkedin && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://linkedin.com/in/${judge.linkedin}`} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {judge.github && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://github.com/${judge.github}`} target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <Card key={project.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                              <p className="text-muted-foreground mb-3">{project.description}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>By {project.author}</span>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {project.likes}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  {project.comments}
                                </div>
                              </div>
                              {project.techStack && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {project.techStack.split(',').map((tech, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tech.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button variant="outline" asChild>
                              <Link href={`/projects/${project.id}`}>
                                View Project
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No projects submitted yet.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Be the first to submit a project when the hackathon begins!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}