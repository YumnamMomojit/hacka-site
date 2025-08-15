import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hackathon = await db.hackathon.findUnique({
      where: { id: params.id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
            website: true
          }
        },
        tracks: {
          orderBy: { name: 'asc' }
        },
        sponsors: {
          orderBy: { tier: 'desc' }
        },
        judges: {
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            registrations: true,
            projects: true,
            tracks: true,
            sponsors: true,
            judges: true
          }
        }
      }
    })

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(hackathon)
  } catch (error) {
    console.error('Error fetching hackathon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hackathon' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      status
    } = body

    const hackathon = await db.hackathon.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(shortDescription && { shortDescription }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(registrationStart && { registrationStart: new Date(registrationStart) }),
        ...(registrationEnd && { registrationEnd: new Date(registrationEnd) }),
        ...(typeof isOnline === 'boolean' && { isOnline }),
        ...(location && { location }),
        ...(maxParticipants && { maxParticipants }),
        ...(prizePool && { prizePool: parseFloat(prizePool) }),
        ...(status && { status })
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

    return NextResponse.json(hackathon)
  } catch (error) {
    console.error('Error updating hackathon:', error)
    return NextResponse.json(
      { error: 'Failed to update hackathon' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.hackathon.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Hackathon deleted successfully' })
  } catch (error) {
    console.error('Error deleting hackathon:', error)
    return NextResponse.json(
      { error: 'Failed to delete hackathon' },
      { status: 500 }
    )
  }
}