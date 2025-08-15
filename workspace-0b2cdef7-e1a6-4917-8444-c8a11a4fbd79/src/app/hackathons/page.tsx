'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, MapPin, Users, Trophy, Search, Filter, Grid, List, Clock } from "lucide-react"
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
  registrationStart: string
  registrationEnd: string
  location: string
  prizePool?: number
  status: string
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

export default function HackathonsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [sortBy, setSortBy] = useState('startDate')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchHackathons()
  }, [currentPage, searchQuery, statusFilter, locationFilter, sortBy])

  const fetchHackathons = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search: searchQuery,
        status: statusFilter,
        location: locationFilter,
        sortBy: sortBy
      })

      const response = await fetch(`/api/hackathons?${params}`)
      if (response.ok) {
        const data = await response.json()
        setHackathons(data.hackathons || [])
        setTotalPages(data.pagination?.pages || 1)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchHackathons()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Hackathons</h1>
              <p className="text-muted-foreground mt-1">Discover exciting opportunities to showcase your skills</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button size="sm">
                Host Hackathon
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="REGISTRATION_OPEN">Registration Open</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={(value) => { setLocationFilter(value); setCurrentPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => { setSortBy(value); setCurrentPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDate">Start Date</SelectItem>
                <SelectItem value="prizePool">Prize Pool</SelectItem>
                <SelectItem value="participants">Participants</SelectItem>
              </SelectContent>
            </Select>
          </form>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {hackathons.length} hackathons
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hackathons Grid/List */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
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
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
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
                  {hackathon.status === 'ONGOING' && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive" className="bg-red-500">
                        <Clock className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{hackathon.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{hackathon.shortDescription || hackathon.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
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
                        ${hackathon.prizePool.toLocaleString()}
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
        ) : (
          <div className="space-y-4">
            {hackathons.map((hackathon) => (
              <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 md:h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={hackathon.bannerImage || "/api/placeholder/400/200"}
                        alt={hackathon.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
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
                          <h3 className="text-xl font-semibold">{hackathon.title}</h3>
                          <p className="text-muted-foreground mt-1">{hackathon.shortDescription || hackathon.description}</p>
                        </div>
                        <div className="text-right">
                          {hackathon.prizePool && (
                            <>
                              <div className="text-lg font-bold text-primary">
                                ${hackathon.prizePool.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">Prize Pool</div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          {formatDate(hackathon.startDate)}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {hackathon.location}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          {hackathon._count?.registrations || 0}{hackathon.maxParticipants ? `/${hackathon.maxParticipants}` : ''}
                        </div>
                        <div className="text-muted-foreground">
                          Organized by {hackathon.organizer?.name || hackathon.organization?.name || 'Unknown'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Link href={`/hackathons/${hackathon.id}`}>
                        <Button>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {hackathons.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No hackathons found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}