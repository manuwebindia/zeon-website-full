import { getPrismaClient } from '@/lib/db';

export async function getApprovedJobs() {
  const prisma = getPrismaClient();
  return prisma.jobPosting.findMany({
    where: { status: 'approved' },
    orderBy: [{ approvedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      jobTitle: true,
      companyName: true,
      companyLogo: true,
      phone: true,
      location: true,
      aboutCompany: true,
      responsibilities: true,
      skillsRequired: true,
      eligibility: true,
      jobTypes: true,
      shiftSchedule: true,
      sourceUrl: true,
      approvedAt: true,
    },
  });
}

export function mapJobToVacancy(job) {
  const parts = [job.aboutCompany, job.skillsRequired, job.eligibility, job.jobTypes, job.shiftSchedule]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter(Boolean);

  const fallbackSlug = (job.jobTitle + '-' + job.companyName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    id: job.id,
    slug: job.slug || fallbackSlug,
    title: job.jobTitle,
    company: job.companyName,
    logo: job.companyLogo || null,
    location: job.location || 'Kerala',
    description: job.aboutCompany || parts[0] || `${job.companyName} is hiring for ${job.jobTitle}.`,
    phone: job.phone,
    jobTypes: job.jobTypes || 'Full-time',
    shiftSchedule: job.shiftSchedule || 'Day Shift',
    responsibilities: job.responsibilities || '',
    skillsRequired: job.skillsRequired || '',
    eligibility: job.eligibility || '',
    sourceUrl: job.sourceUrl || '',
  };
}

export async function getJobBySlug(slug) {
  if (!slug) return null;
  const prisma = getPrismaClient();

  // 1. Direct match by slug
  let job = await prisma.jobPosting.findFirst({
    where: { slug, status: 'approved' },
  });

  if (job) return job;

  // 2. Fuzzy match or slug variations
  const allApproved = await prisma.jobPosting.findMany({
    where: { status: 'approved' },
  });

  const cleanSlug = String(slug).toLowerCase().replace(/[^a-z0-9]/g, '');

  job = allApproved.find((j) => {
    if (!j.slug) return false;
    const itemClean = j.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    return itemClean === cleanSlug || itemClean.includes(cleanSlug) || cleanSlug.includes(itemClean);
  });

  return job || null;
}

export async function getAllApprovedJobSlugs() {
  const prisma = getPrismaClient();
  const jobs = await prisma.jobPosting.findMany({
    where: { status: 'approved' },
    select: { slug: true },
  });
  return jobs.map((j) => j.slug).filter(Boolean);
}
