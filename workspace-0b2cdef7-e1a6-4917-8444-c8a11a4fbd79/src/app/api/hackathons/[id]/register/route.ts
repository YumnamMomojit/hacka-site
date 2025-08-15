import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if hackathon exists and registration is open
    const hackathon = await db.hackathon.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            registrations: true
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

    // Check if registration is open
    const now = new Date()
    if (now < hackathon.registrationStart || now > hackathon.registrationEnd) {
      return NextResponse.json(
        { error: 'Registration is not open' },
        { status: 400 }
      )
    }

    // Check if hackathon is full
    if (hackathon.maxParticipants && hackathon._count.registrations >= hackathon.maxParticipants) {
      return NextResponse.json(
        { error: 'Hackathon is full' },
        { status: 400 }
      )
    }

    // Check if user is already registered
    const existingRegistration = await db.hackathonRegistration.findUnique({
      where: {
        userId_hackathonId: {
          userId,
          hackathonId: params.id
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'User is already registered' },
        { status: 400 }
      )
    }

    // Create registration
    const registration = await db.hackathonRegistration.create({
      data: {
        userId,
        hackathonId: params.id,
        status: 'REGISTERED'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        hackathon: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true
          }
        }
      }
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error('Error registering for hackathon:', error)
    return NextResponse.json(
      { error: 'Failed to register for hackathon' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    await db.hackathonRegistration.delete({
      where: {
        userId_hackathonId: {
          userId,
          hackathonId: params.id
        }
      }
    })

    return NextResponse.json({ message: 'Registration cancelled successfully' })
  } catch (error) {
    console.error('Error cancelling registration:', error)
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    )
  }
}