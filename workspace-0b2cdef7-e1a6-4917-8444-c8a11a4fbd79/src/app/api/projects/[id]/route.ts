import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await db.projectSubmission.findUnique({
      where: { id: params.id },
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
        hackathon: true,
        track: true,
        comments: {
          include: {
            author: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const projectWithStats = {
      ...project,
      likesCount: 0, // ProjectLike model doesn't exist
      commentsCount: project.comments.length,
      isLiked: false // This would be set based on current user in a real app
    }

    return NextResponse.json(projectWithStats)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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
      longDescription,
      githubUrl,
      demoUrl,
      images,
      techStack,
      trackId
    } = body

    const existingProject = await db.projectSubmission.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const project = await db.projectSubmission.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(longDescription && { longDescription }),
        ...(githubUrl && { githubUrl }),
        ...(demoUrl && { demoUrl }),
        ...(images && { images }),
        ...(techStack && { techStack }),
        ...(trackId && { trackId })
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

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingProject = await db.projectSubmission.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await db.projectSubmission.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}