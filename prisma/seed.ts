import {
  PrismaClient,
  UserRole,
  MissionStatus,
  ProficiencyLevel,
} from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

// Main seeding function
async function main() {
  // Create users with their related models
  const users = await Promise.all([
    prisma.user.create({
      data: {
        login: "john.doe",
        password: await hash("password123", 10),
        address: "123 Main St",
        bankAccount: "FR123456789",
        walletAddress: "0x123...",
        phoneNumber: "+33612345678",
        role: UserRole.FREELANCER,
        freelance: {
          create: {
            firstName: "John",
            lastName: "Doe",
            vat: "FR12345678900",
          },
        },
      },
      include: {
        freelance: true,
        client: true,
      },
    }),
    prisma.user.create({
      data: {
        login: "company.inc",
        password: await hash("password123", 10),
        address: "456 Business Ave",
        bankAccount: "FR987654321",
        walletAddress: "0x456...",
        phoneNumber: "+33687654321",
        role: UserRole.CLIENT,
        client: {
          create: {
            company: "Tech Solutions Inc",
            vat: "FR98765432100",
          },
        },
      },
      include: {
        freelance: true,
        client: true,
      },
    }),
  ]);

  // Create or get categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Web Development' },
      update: {},
      create: {
        name: 'Web Development',
        description: 'Frontend and backend web development projects'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Mobile Development' },
      update: {},
      create: {
        name: 'Mobile Development',
        description: 'iOS and Android app development'
      }
    }),
    prisma.category.upsert({
      where: { name: 'UI/UX Design' },
      update: {},
      create: {
        name: 'UI/UX Design',
        description: 'User interface and experience design'
      }
    })
  ]);

  // Create skills
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        name: "React",
        description: "React.js development",
        proficiencyLevel: ProficiencyLevel.EXPERT,
      },
    }),
    prisma.skill.create({
      data: {
        name: "Node.js",
        description: "Node.js backend development",
        proficiencyLevel: ProficiencyLevel.INTERMEDIATE,
      },
    }),
  ]);

  // Create services
  await Promise.all([
    prisma.service.create({
      data: {
        name: "Web Development",
        price: 500,
        description: "Full-stack web development services",
        skillId: skills[0].id,
        freelanceId: users[0].freelance!.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "API Development",
        price: 400,
        description: "RESTful API development",
        skillId: skills[1].id,
        freelanceId: users[0].freelance!.id,
      },
    }),
  ]);

  // Create portfolio
  await prisma.portfolio.create({
    data: {
      name: "E-commerce Platform",
      description: "A modern e-commerce platform built with Next.js",
      projectUrl: "https://github.com/johndoe/ecommerce",
      freelanceId: users[0].freelance!.id,
    },
  });

  // Create or get test client
  const client = await prisma.client.upsert({
    where: { 
      userId: (await prisma.user.findUnique({
        where: { login: 'techcorp' }
      }))?.id || ''
    },
    update: {},
    create: {
      company: 'TechCorp Inc.',
      vat: 'FR12345678900',
      user: {
        create: {
          login: 'techcorp',
          password: 'placeholder',
          role: 'CLIENT'
        }
      }
    }
  });

  // Create test missions
  const missions = await Promise.all([
    prisma.mission.create({
      data: {
        status: 'OPEN',
        dailyRate: 500,
        timeframe: 30,
        description: 'Build a modern e-commerce platform with Next.js and Stripe integration',
        client: {
          connect: { id: client.id }
        },
        categories: {
          connect: [{ id: categories[0].id }]
        }
      }
    }),
    prisma.mission.create({
      data: {
        status: 'IN_PROGRESS',
        dailyRate: 450,
        timeframe: 45,
        description: 'Develop a cross-platform mobile app for food delivery service',
        client: {
          connect: { id: client.id }
        },
        categories: {
          connect: [{ id: categories[1].id }]
        }
      }
    }),
    prisma.mission.create({
      data: {
        status: 'OPEN',
        dailyRate: 400,
        timeframe: 20,
        description: 'Redesign the user interface for our SaaS platform',
        client: {
          connect: { id: client.id }
        },
        categories: {
          connect: [{ id: categories[2].id }]
        }
      }
    })
  ]);

  // Create contract
  await prisma.contract.create({
    data: {
      contractTerms: "Standard freelance contract terms",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      missionId: missions[0].id,
    },
  });

  // Create payment
  await prisma.payment.create({
    data: {
      amount: 15000,
      currency: "EUR",
      paymentMethod: "Bank Transfer",
      transactionDate: new Date(),
      missionId: missions[0].id,
    },
  });

  // Create smart contract
  await prisma.smartContract.create({
    data: {
      contractAddress: "0x789...",
      creatorId: users[0].id,
      balance: 1000,
    },
  });

  // Create messages
  await Promise.all([
    prisma.message.create({
      data: {
        content: "Hello, I am interested in your project",
        status: "SENT",
        userId: users[0].id,
      },
    }),
    prisma.message.create({
      data: {
        content: "Thank you for your interest",
        status: "SENT",
        userId: users[1].id,
      },
    }),
  ]);

  // Create chatbot
  await prisma.chatbot.create({
    data: {
      name: "Support Bot",
      version: "1.0.0",
      language: "en",
    },
  });

  console.log('Seed data created:', { categories, client, missions });
}

// Execute seeding and handle errors
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
