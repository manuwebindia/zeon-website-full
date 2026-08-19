const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const ALL_PERMISSIONS = [
  'dashboard.view',
  'blogs.view',
  'blogs.create',
  'blogs.edit',
  'blogs.delete',
  'blogs.publish',
  'media.view',
  'media.upload',
  'settings.view',
  'settings.edit',
  'users.view',
  'users.create',
  'users.edit',
  'users.delete',
  'groups.manage',
  'analytics.view',
  'seo.manage',
  'chatbot-leads.view',
  'chatbot-leads.edit',
  'chatbot-leads.delete',
  'chat-analytics.view',
  'contact-leads.view',
  'contact-leads.edit',
  'contact-leads.delete',
  'job-postings.view',
  'job-postings.edit',
  'job-postings.delete',
  'offers.manage',
  'gallery.view',
  'gallery.create',
  'gallery.edit',
  'gallery.delete',
  'gallery.publish',
  'pages.view',
  'pages.create',
  'pages.edit',
  'pages.delete',
  'pages.publish',
];

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  let passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!passwordHash) {
    const plain = process.env.ADMIN_PASSWORD || 'zeon@admin2026';
    passwordHash = await bcrypt.hash(plain, 10);
    console.log('No ADMIN_PASSWORD_HASH set — hashed ADMIN_PASSWORD instead.');
  }

  const group = await prisma.group.upsert({
    where: { name: 'Super Admin' },
    update: {
      description: 'Full access to all admin panel features',
      permissions: ALL_PERMISSIONS,
    },
    create: {
      name: 'Super Admin',
      description: 'Full access to all admin panel features',
      permissions: ALL_PERMISSIONS,
    },
  });

  const user = await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      groupId: group.id,
      isActive: true,
      displayName: 'Super Admin',
    },
    create: {
      username,
      displayName: 'Super Admin',
      email: process.env.ADMIN_EMAIL || null,
      passwordHash,
      groupId: group.id,
      isActive: true,
    },
  });

  console.log(`✔ Super Admin group ready (${ALL_PERMISSIONS.length} permissions)`);
  console.log(`✔ Admin user seeded: "${user.username}"`);

  const jobCount = await prisma.jobPosting.count();
  if (jobCount === 0) {
    const { LEGACY_VACANCIES } = await import('../src/data/legacy-vacancies.js');
    const now = new Date();
    await prisma.jobPosting.createMany({
      data: LEGACY_VACANCIES.map((job) => ({
        companyName: job.company,
        jobTitle: job.title,
        phone: '0000000000',
        location: job.location,
        aboutCompany: job.description,
        status: 'approved',
        approvedAt: now,
        source: 'seed',
      })),
    });
    console.log(`✔ Seeded ${LEGACY_VACANCIES.length} approved legacy job postings`);
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
