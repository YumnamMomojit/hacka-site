import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const location = searchParams.get('location') || 'all'
    const sortBy = searchParams.get('sortBy') || 'startDate'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      where.status = status
    }

    if (location === 'virtual') {
      where.isOnline = true
    } else if (location === 'in-person') {
      where.isOnline = false
    }

    // Build orderBy clause
    let orderBy: any = { startDate: 'asc' }
    
    switch (sortBy) {
      case 'prizePool':
        orderBy = { prizePool: 'desc' }
        break
      case 'participants':
        orderBy = { registrations: { _count: 'desc' } }
        break
      case 'startDate':
      default:
        orderBy = { startDate: 'asc' }
        break
    }

    // Get hackathons with related data
    const [hackathons, totalCount] = await Promise.all([
      db.hackathon.findMany({
        where,
        include: {
          organizer: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          organization: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          },
          _count: {
            select: {
              registrations: true,
              projects: true,
              tracks: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      db.hackathon.count({ where })
    ])

    return NextResponse.json({
      hackathons,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching hackathons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hackathons' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      shortDescription,
      startDate,
      endDate,
      registrationStart,
      registrationEnd,
      isOnline,
      location,
      maxParticipants,
      prizePool,
      organizerId,
      organizationId
    } = body

    // Validate required fields
    if (!title || !description || !startDate || !endDate || !registrationStart || !registrationEnd || !organizerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create hackathon
    const hackathon = await db.hackathon.create({
      data: {
        title,
        description,
        shortDescription,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationStart: new Date(registrationStart),
        registrationEnd: new Date(registrationEnd),
        isOnline: isOnline || true,
        location: location || (isOnline ? 'Virtual' : undefined),
        maxParticipants,
        prizePool: prizePool ? parseFloat(prizePool) : null,
        organizerId,
        organizationId,
        status: 'UPCOMING'
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true,
            logo: true
          }
        }
      }
    })

    return NextResponse.json(hackathon, { status: 201 })
  } catch (error) {
    console.error('Error creating hackathon:', error)
    return NextResponse.json(
      { error: 'Failed to create hackathon' },
      { status: 500 }
    )
  }
}