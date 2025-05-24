import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();
const CLERK_API_URL = 'https://api.clerk.dev/v1';
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

// Secure passwords for each user type
const PASSWORDS = {
  freelancer: 'Fr33l@nc3r2024!Secure',
  client1: 'Cl13nt2024!Secure',
  client2: 'T3chC0rp2024!Secure',
  support: 'Supp0rt2024!Secure',
  admin: 'Adm1n2024!Secure'
};

async function createClerkUser(email: string, firstName: string, lastName: string, password: string) {
  try {
    const response = await fetch(`${CLERK_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: [email],
        first_name: firstName,
        last_name: lastName,
        password: password,
        public_metadata: {
          role: 'user'
        }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create user: ${JSON.stringify(error)}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error(`Error creating Clerk user for ${email}:`, error);
    throw error;
  }
}

async function main() {
  // Create test users in Clerk
  const clerkUsers = await Promise.all([
    createClerkUser('john.doe@example.com', 'John', 'Doe', PASSWORDS.freelancer),
    createClerkUser('company.inc@example.com', 'Company', 'Inc', PASSWORDS.client1),
    createClerkUser('techcorp@example.com', 'Tech', 'Corp', PASSWORDS.client2),
    createClerkUser('support@example.com', 'Support', 'Team', PASSWORDS.support),
    createClerkUser('admin@example.com', 'Admin', 'User', PASSWORDS.admin),
  ]);

  // Create or update users in our database
  await Promise.all([
    prisma.user.upsert({
      where: { login: 'john.doe' },
      update: {
        clerkId: clerkUsers[0].id,
      },
      create: {
        login: 'john.doe',
        password: await hash(PASSWORDS.freelancer, 10),
        address: '123 Main St',
        bankAccount: 'FR123456789',
        walletAddress: '0x123...',
        phoneNumber: '+33612345678',
        role: UserRole.FREELANCER,
        clerkId: clerkUsers[0].id,
        freelance: {
          create: {
            firstName: 'John',
            lastName: 'Doe',
            vat: 'FR12345678900',
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { login: 'company.inc' },
      update: {
        clerkId: clerkUsers[1].id,
      },
      create: {
        login: 'company.inc',
        password: await hash(PASSWORDS.client1, 10),
        address: '456 Business Ave',
        bankAccount: 'FR987654321',
        walletAddress: '0x456...',
        phoneNumber: '+33687654321',
        role: UserRole.CLIENT,
        clerkId: clerkUsers[1].id,
        client: {
          create: {
            company: 'Tech Solutions Inc',
            vat: 'FR98765432100',
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { login: 'techcorp' },
      update: {
        clerkId: clerkUsers[2].id,
      },
      create: {
        login: 'techcorp',
        password: await hash(PASSWORDS.client2, 10),
        address: '789 Tech Street',
        bankAccount: 'FR12345678900',
        walletAddress: '0x789...',
        phoneNumber: '+33612345679',
        role: UserRole.CLIENT,
        clerkId: clerkUsers[2].id,
        client: {
          create: {
            company: 'TechCorp Inc.',
            vat: 'FR12345678900',
          },
        },
      },
    }),
    prisma.user.upsert({
      where: { login: 'support' },
      update: {
        clerkId: clerkUsers[3].id,
      },
      create: {
        login: 'support',
        password: await hash(PASSWORDS.support, 10),
        address: 'Support HQ',
        bankAccount: 'FR111111111',
        walletAddress: '0x111...',
        phoneNumber: '+33611111111',
        role: UserRole.SUPPORT,
        clerkId: clerkUsers[3].id,
      },
    }),
    prisma.user.upsert({
      where: { login: 'admin' },
      update: {
        clerkId: clerkUsers[4].id,
      },
      create: {
        login: 'admin',
        password: await hash(PASSWORDS.admin, 10),
        address: 'Admin HQ',
        bankAccount: 'FR222222222',
        walletAddress: '0x222...',
        phoneNumber: '+33622222222',
        role: UserRole.ADMIN,
        clerkId: clerkUsers[4].id,
      },
    }),
  ]);

  console.log('Successfully created and synced users with Clerk!');
  console.log('\nUser credentials:');
  console.log('----------------');
  console.log('Freelancer (john.doe@example.com):', PASSWORDS.freelancer);
  console.log('Client 1 (company.inc@example.com):', PASSWORDS.client1);
  console.log('Client 2 (techcorp@example.com):', PASSWORDS.client2);
  console.log('Support (support@example.com):', PASSWORDS.support);
  console.log('Admin (admin@example.com):', PASSWORDS.admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 