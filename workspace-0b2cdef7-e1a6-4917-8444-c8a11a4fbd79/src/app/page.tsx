'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Users, Trophy, ArrowRight, Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import { UserMenu } from "@/components/auth/user-menu"

interface Hackathon {
  id: string
  title: string
  description: string
  shortDescription?: string
  bannerImage?: string
  startDate: string
  endDate: string
  location: string
  prizePool?: number
  status: string
  participants?: number
  maxParticipants?: number
  organizer?: {
    id: string
    name: string
    avatar?: string
  }
  organization?: {
    id: string
    name: string
    logo?: string
  }
  _count?: {
    registrations: number
    projects: number
    tracks: number
  }
}

export default function Home() {
  const [featuredHackathons, setFeaturedHackathons] = useState<Hackathon[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedHackathons()
  }, [])

  const fetchFeaturedHackathons = async () => {
    try {
      const response = await fetch('/api/hackathons?limit=6&sortBy=startDate')
      if (response.ok) {
        const data = await response.json()
        setFeaturedHackathons(data.hackathons || [])
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">HackHub</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/hackathons" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hackathons
                </Link>
                <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="/organize" className="text-muted-foreground hover:text-foreground transition-colors">
                  Organize
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Build the Future of Web3
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the world's most innovative hackathons. Connect with developers, create amazing projects, and win prizes in cryptocurrency and NFTs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hackathons">
                <Button size="lg" className="text-lg px-8">
                  Explore Hackathons
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/organize">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Host a Hackathon
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Hackathons Hosted</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Active Developers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">$2M+</div>
              <div className="text-muted-foreground">Prize Pool</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Projects Built</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hackathons */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Hackathons</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover exciting opportunities to showcase your skills and compete with developers worldwide
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="aspect-video bg-muted"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="h-4 bg-muted rounded w-4/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHackathons.map((hackathon) => (
                <Card key={hackathon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={hackathon.bannerImage || "/api/placeholder/400/200"}
                      alt={hackathon.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(hackathon.status)}>
                        {getStatusText(hackathon.status)}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">{hackathon.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {hackathon.shortDescription || hackathon.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {hackathon.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {hackathon._count?.registrations || 0}{hackathon.maxParticipants ? `/${hackathon.maxParticipants}` : ''} participants
                      </div>
                      {hackathon.prizePool && (
                        <div className="flex items-center text-sm font-semibold text-primary">
                          <Trophy className="w-4 h-4 mr-2" />
                          ${hackathon.prizePool.toLocaleString()} prize pool
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/hackathons/${hackathon.id}`} className="w-full">
                      <Button className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/hackathons">
              <Button variant="outline" size="lg">
                View All Hackathons
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of developers creating the future of Web3. Participate in hackathons, win prizes, and make your mark.
          </p>
          <Link href="/hackathons">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl">HackHub</span>
              </div>
              <p className="text-muted-foreground">
                The premier platform for Web3 hackathons and innovation.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Platform</h3>
              <div className="space-y-2">
                <Link href="/hackathons" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Hackathons
                </Link>
                <Link href="/projects" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="/organize" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Organize
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Resources</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
                <Link href="/blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
                <Link href="/community" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Connect</h3>
              <div className="flex space-x-4">
                <Github className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© 2024 HackHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}