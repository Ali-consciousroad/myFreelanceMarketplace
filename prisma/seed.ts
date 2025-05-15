import { PrismaClient, UserRole, MissionStatus, ProficiencyLevel } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

// Main seeding function
async function main() {
  // Create categories first as they are referenced by projects
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Web Development',
        description: 'Projects related to website and web application development'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Mobile Development',
        description: 'Projects related to mobile app development'
      }
    }),
    prisma.category.create({
      data: {
        name: 'UI/UX Design',
        description: 'Projects related to user interface and experience design'
      }
    })
  ])

  // Create users with their profiles
  const users = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: 'user_1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        profile: {
          create: {
            title: 'Senior Web Developer',
            bio: 'Full-stack developer with 5 years of experience',
            hourlyRate: 50,
            skills: ['React', 'Node.js', 'TypeScript'],
            availability: 'Full-time'
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        clerkId: 'user_2',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        profile: {
          create: {
            title: 'UI/UX Designer',
            bio: 'Creative designer with a passion for user-centered design',
            hourlyRate: 45,
            skills: ['Figma', 'Adobe XD', 'Sketch'],
            availability: 'Part-time'
          }
        }
      }
    })
  ])

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'E-commerce Website',
        description: 'Build a modern e-commerce platform',
        budget: 5000,
        deadline: new Date('2024-12-31'),
        status: 'OPEN',
        ownerId: users[0].id,
        categoryId: categories[0].id
      }
    }),
    prisma.project.create({
      data: {
        title: 'Mobile App Design',
        description: 'Design a fitness tracking app',
        budget: 3000,
        deadline: new Date('2024-11-30'),
        status: 'OPEN',
        ownerId: users[1].id,
        categoryId: categories[2].id
      }
    })
  ])

  // Create proposals
  await Promise.all([
    prisma.proposal.create({
      data: {
        coverLetter: 'I have extensive experience in e-commerce development',
        bidAmount: 4500,
        status: 'PENDING',
        projectId: projects[0].id,
        freelancerId: users[1].id
      }
    }),
    prisma.proposal.create({
      data: {
        coverLetter: 'I specialize in mobile app design',
        bidAmount: 2800,
        status: 'PENDING',
        projectId: projects[1].id,
        freelancerId: users[0].id
      }
    })
  ])

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Excellent work on the project!',
        projectId: projects[0].id,
        reviewerId: users[0].id,
        reviewedUserId: users[1].id
      }
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: 'Great communication and delivery',
        projectId: projects[1].id,
        reviewerId: users[1].id,
        reviewedUserId: users[0].id
      }
    })
  ])

  console.log('Database has been seeded. 🌱')
}

// Execute seeding and handle errors
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 