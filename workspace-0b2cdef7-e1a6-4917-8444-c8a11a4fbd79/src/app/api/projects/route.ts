import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hackathonId = searchParams.get('hackathonId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where = hackathonId ? { hackathonId } : {}

    const [projects, total] = await Promise.all([
      db.projectSubmission.findMany({
        where,
        include: {
          author: true,
          team: {
            include: {
              members: {
                include: {
                  user: true
                }
              }
            }
          },
          hackathon: {
            select: {
              id: true,
              title: true,
              status: true
            }
          },
          comments: {
            include: {
              author: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          track: true
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        take: limit,
        skip: offset
      }),
      db.projectSubmission.count({ where })
    ])

    const projectsWithStats = projects.map(project => ({
      ...project,
      likesCount: 0, // ProjectLike model doesn't exist
      commentsCount: project.comments.length,
      isLiked: false // This would be set based on current user in a real app
    }))

    return NextResponse.json({
      projects: projectsWithStats,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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
      longDescription,
      githubUrl,
      demoUrl,
      images,
      techStack,
      teamId,
      hackathonId,
      trackId
    } = body

    // Validate required fields
    if (!title || !description || !teamId || !hackathonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if team exists and belongs to the hackathon
    const team = await db.team.findFirst({
      where: {
        id: teamId,
        hackathonId
      }
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found or not part of this hackathon' },
        { status: 404 }
      )
    }

    // Check if team already has a submission
    const existingSubmission = await db.projectSubmission.findFirst({
      where: {
        teamId
      }
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Team already has a project submission' },
        { status: 400 }
      )
    }

    const project = await db.projectSubmission.create({
      data: {
        title,
        description,
        longDescription,
        githubUrl,
        demoUrl,
        images,
        techStack,
        teamId,
        hackathonId,
        trackId
      },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        },
        hackathon: true,
        track: true
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}