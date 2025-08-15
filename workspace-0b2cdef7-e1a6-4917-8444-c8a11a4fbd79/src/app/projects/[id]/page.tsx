'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CalendarDays, 
  ExternalLink, 
  Github, 
  Heart, 
  MessageSquare, 
  Share2, 
  Users,
  Trophy,
  Code,
  Globe,
  Send,
  ThumbsUp
} from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  githubUrl?: string
  demoUrl?: string
  images?: string
  techStack?: string
  team: {
    id: string
    name: string
    members: Array<{
      user: {
        id: string
        name: string
        avatar?: string
      }
    }>
  }
  hackathon: {
    id: string
    title: string
    status: string
  }
  track?: {
    id: string
    name: string
  }
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      name: string
      avatar?: string
    }
  }>
  likesCount: number
  commentsCount: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comments, setComments] = useState<Project['comments']>([])

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch project')
        }
        const data = await response.json()
        setProject(data)
        setIsLiked(data.isLiked)
        setLikesCount(data.likesCount)
        setComments(data.comments)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const handleLike = async () => {
    if (!project) return

    try {
      // Mock user ID - in a real app, this would come from authentication
      const userId = 'mock-user-id'
      const response = await fetch(`/api/projects/${project.id}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setLikesCount(prev => data.liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project || !newComment.trim()) return

    try {
      // Mock user ID - in a real app, this would come from authentication
      const userId = 'mock-user-id'
      const response = await fetch(`/api/projects/${project.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId
        }),
      })

      if (response.ok) {
        const comment = await response.json()
        setComments(prev => [comment, ...prev])
        setNewComment('')
      }
    } catch (error) {
      console.error('Error adding comment:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <p className="text-muted-foreground mb-4">{error || 'The project you are looking for does not exist.'}</p>
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
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">
                  <Code className="w-3 h-3 mr-1" />
                  Project Submission
                </Badge>
                {project.track && (
                  <Badge variant="outline">
                    <Trophy className="w-3 h-3 mr-1" />
                    {project.track.name}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Submitted {formatDate(project.createdAt)}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {project.team.members.length} team members
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  {likesCount} likes
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {comments.length} comments
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  onClick={handleLike}
                  className="flex items-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked' : 'Like'} ({likesCount})
                </Button>
                
                {project.githubUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                )}
                
                {project.demoUrl && (
                  <Button variant="outline" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            <div className="lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hackathon</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/hackathons/${project.hackathon.id}`} className="hover:underline">
                    <h3 className="font-semibold mb-2">{project.hackathon.title}</h3>
                  </Link>
                  <Badge variant="outline" className="mb-4">
                    {project.hackathon.status.replace('_', ' ')}
                  </Badge>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Team</h4>
                      <div className="space-y-2">
                        {project.team.members.map((member, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={member.user.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.user.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {project.longDescription.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {project.techStack && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tech Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.split(',').map((tech, index) => (
                          <Badge key={index} variant="secondary">
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {project.images && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Screenshots</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.images.split(',').map((image, index) => (
                          <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                            <img
                              src={image.trim()}
                              alt={`Project screenshot ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleComment} className="space-y-4">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <Button type="submit" disabled={!newComment.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </form>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar>
                            <AvatarImage src={comment.user.avatar} />
                            <AvatarFallback>
                              {comment.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">{comment.user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Meet the talented individuals behind this project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.team.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={member.user.avatar} />
                            <AvatarFallback>
                              {member.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{member.user.name}</h4>
                            <p className="text-sm text-muted-foreground">Team Member</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant={isLiked ? "default" : "outline"}
                  onClick={handleLike}
                  className="w-full justify-start"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  {isLiked ? 'Liked' : 'Like Project'}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Project
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likes</span>
                  <span className="font-semibold">{likesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="font-semibold">{comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="font-semibold">{project.team.members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="font-semibold">{formatDate(project.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}