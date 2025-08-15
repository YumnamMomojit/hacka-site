import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', // hashed 'password'
      role: 'SUPERADMIN',
      bio: 'Super Administrator with full system access',
      location: 'San Francisco, CA',
      skills: JSON.stringify(['System Administration', 'Security', 'Management'])
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6',
      role: 'ORGANIZER',
      bio: 'Event organizer and community builder',
      location: 'New York, NY',
      skills: JSON.stringify(['Event Management', 'Marketing', 'Community'])
    }
  })

  const user3 = await prisma.user.create({
    data: {
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8d4B3',
      name: 'Alice Web3',
      role: 'PARTICIPANT',
      bio: 'Blockchain developer and DeFi enthusiast',
      location: 'Remote',
      skills: JSON.stringify(['Solidity', 'DeFi', 'Smart Contracts', 'Web3'])
    }
  })

  // Create sample organization
  const org1 = await prisma.organization.create({
    data: {
      name: 'DeFi Alliance',
      description: 'Leading organization promoting innovation in decentralized finance',
      website: 'https://defialliance.com',
      twitter: '@defialliance',
      github: 'defialliance'
    }
  })

  // Create sample hackathons
  const hackathon1 = await prisma.hackathon.create({
    data: {
      title: 'DeFi Innovation Challenge',
      description: 'Build the future of decentralized finance with cutting-edge blockchain technology. Create innovative solutions for lending, borrowing, trading, and yield farming.',
      shortDescription: 'Create innovative DeFi solutions',
      startDate: new Date('2024-03-15T09:00:00Z'),
      endDate: new Date('2024-03-17T18:00:00Z'),
      registrationStart: new Date('2024-02-15T00:00:00Z'),
      registrationEnd: new Date('2024-03-14T23:59:59Z'),
      location: 'Virtual',
      isOnline: true,
      prizePool: 50000,
      maxParticipants: 500,
      status: 'REGISTRATION_OPEN',
      organizerId: user2.id,
      organizationId: org1.id
    }
  })

  const hackathon2 = await prisma.hackathon.create({
    data: {
      title: 'AI & Web3 Integration',
      description: 'Combine artificial intelligence with blockchain technology to create next-generation applications. Explore the intersection of AI and decentralized systems.',
      shortDescription: 'Merge AI with blockchain',
      startDate: new Date('2024-04-01T09:00:00Z'),
      endDate: new Date('2024-04-03T18:00:00Z'),
      registrationStart: new Date('2024-03-01T00:00:00Z'),
      registrationEnd: new Date('2024-03-31T23:59:59Z'),
      location: 'San Francisco',
      isOnline: false,
      prizePool: 75000,
      maxParticipants: 300,
      status: 'UPCOMING',
      organizerId: user2.id
    }
  })

  const hackathon3 = await prisma.hackathon.create({
    data: {
      title: 'Gaming & Metaverse',
      description: 'Build immersive gaming experiences and metaverse applications using Web3 technologies. Create the future of digital entertainment.',
      shortDescription: 'Create the future of gaming',
      startDate: new Date('2024-04-20T09:00:00Z'),
      endDate: new Date('2024-04-22T18:00:00Z'),
      registrationStart: new Date('2024-03-20T00:00:00Z'),
      registrationEnd: new Date('2024-04-19T23:59:59Z'),
      location: 'Virtual',
      isOnline: true,
      prizePool: 100000,
      maxParticipants: 400,
      status: 'UPCOMING',
      organizerId: user2.id
    }
  })

  // Create tracks for hackathon1
  const track1 = await prisma.hackathonTrack.create({
    data: {
      name: 'Lending & Borrowing',
      description: 'Create innovative lending and borrowing protocols',
      prize: '$15,000',
      hackathonId: hackathon1.id
    }
  })

  const track2 = await prisma.hackathonTrack.create({
    data: {
      name: 'DEX Innovation',
      description: 'Build next-generation decentralized exchanges',
      prize: '$20,000',
      hackathonId: hackathon1.id
    }
  })

  const track3 = await prisma.hackathonTrack.create({
    data: {
      name: 'Yield Farming',
      description: 'Develop creative yield optimization strategies',
      prize: '$15,000',
      hackathonId: hackathon1.id
    }
  })

  // Create sponsors for hackathon1
  await prisma.sponsor.create({
    data: {
      name: 'Crypto Ventures',
      website: 'https://cryptoventures.com',
      tier: 'PLATINUM',
      hackathonId: hackathon1.id
    }
  })

  await prisma.sponsor.create({
    data: {
      name: 'Blockchain Labs',
      website: 'https://blockchainlabs.com',
      tier: 'GOLD',
      hackathonId: hackathon1.id
    }
  })

  // Create judges for hackathon1
  await prisma.judge.create({
    data: {
      name: 'Dr. Sarah Chen',
      title: 'Chief Technology Officer',
      company: 'DeFi Protocol',
      bio: 'Leading expert in DeFi protocols and smart contract security',
      hackathonId: hackathon1.id
    }
  })

  await prisma.judge.create({
    data: {
      name: 'Michael Rodriguez',
      title: 'Venture Partner',
      company: 'Crypto Capital',
      bio: 'Early-stage investor in successful DeFi projects',
      hackathonId: hackathon1.id
    }
  })

  // Create registrations
  await prisma.hackathonRegistration.create({
    data: {
      userId: user1.id,
      hackathonId: hackathon1.id,
      status: 'REGISTERED'
    }
  })

  await prisma.hackathonRegistration.create({
    data: {
      userId: user3.id,
      hackathonId: hackathon1.id,
      status: 'REGISTERED'
    }
  })

  // Create teams
  const team1 = await prisma.team.create({
    data: {
      name: 'Team Alpha',
      description: 'Building innovative DeFi solutions',
      maxMembers: 4
    }
  })

  const team2 = await prisma.team.create({
    data: {
      name: 'Blockchain Builders',
      description: 'Cross-chain DeFi protocols',
      maxMembers: 3
    }
  })

  // Add team members
  await prisma.teamMember.create({
    data: {
      userId: user1.id,
      teamId: team1.id,
      role: 'LEADER'
    }
  })

  await prisma.teamMember.create({
    data: {
      userId: user3.id,
      teamId: team2.id,
      role: 'LEADER'
    }
  })

  // Create project submissions
  await prisma.projectSubmission.create({
    data: {
      title: 'Yield Optimizer Pro',
      description: 'An automated yield farming optimization platform',
      githubUrl: 'https://github.com/teamalpha/yield-optimizer',
      demoUrl: 'https://yield-optimizer-demo.vercel.app',
      images: 'https://via.placeholder.com/800x600,https://via.placeholder.com/800x600',
      techStack: 'Solidity,React,Web3.js,TypeScript',
      authorId: user1.id,
      hackathonId: hackathon1.id,
      teamId: team1.id,
      trackId: track1.id
    }
  })

  await prisma.projectSubmission.create({
    data: {
      title: 'Cross-Chain Lending Protocol',
      description: 'Multi-chain lending and borrowing solution',
      githubUrl: 'https://github.com/blockchain-builders/cross-chain-lending',
      demoUrl: 'https://cross-chain-lending-demo.vercel.app',
      images: 'https://via.placeholder.com/800x600,https://via.placeholder.com/800x600',
      techStack: 'Solidity,TypeScript,The Graph,Web3.js',
      authorId: user3.id,
      hackathonId: hackathon1.id,
      teamId: team2.id,
      trackId: track2.id
    }
  })

  // Create some comments and likes
  const project1 = await prisma.projectSubmission.findFirst({
    where: { title: 'Yield Optimizer Pro' }
  })

  const project2 = await prisma.projectSubmission.findFirst({
    where: { title: 'Cross-Chain Lending Protocol' }
  })

  if (project1) {
    await prisma.comment.create({
      data: {
        content: 'Great project! Love the optimization algorithm.',
        authorId: user3.id,
        projectId: project1.id
      }
    })
  }

  if (project2) {
    await prisma.comment.create({
      data: {
        content: 'Impressive cross-chain functionality!',
        authorId: user1.id,
        projectId: project2.id
      }
    })
  }

  console.log('Database seeded successfully!')
  console.log('Sample users created:')
  console.log('- John Doe (john@example.com / password)')
  console.log('- Jane Smith (jane@example.com / password)')
  console.log('- Alice Web3 (wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f8d4B3)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })