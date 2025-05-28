import { clerkClient } from '@clerk/nextjs/server';

async function main() {
  try {
    // Get all users
    const users = await clerkClient.users.getUserList();
    console.log('Found users:', users.map(u => ({ id: u.id, email: u.emailAddresses[0]?.emailAddress })));

    // Find admin user
    const adminUser = users.find(u => 
      u.emailAddresses.some(e => e.emailAddress === 'admin@example.com')
    );

    if (!adminUser) {
      console.error('Admin user not found in Clerk');
      return;
    }

    console.log('Found admin user:', adminUser.id);

    // Update user metadata
    const updatedUser = await clerkClient.users.updateUser(adminUser.id, {
      publicMetadata: { role: 'ADMIN' }
    });

    console.log('Updated admin user:', {
      id: updatedUser.id,
      email: updatedUser.emailAddresses[0]?.emailAddress,
      metadata: updatedUser.publicMetadata
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
  }
}

main(); 