import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { login: 'admin' },
      update: {},
      create: {
        login: 'admin',
        password: await hash('Adm1n2024!Secure', 10),
        role: UserRole.ADMIN,
        address: 'Admin HQ',
        bankAccount: 'FR222222222',
        walletAddress: '0x222...',
        phoneNumber: '+33622222222',
      },
    });

    console.log('Admin user created/updated:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 