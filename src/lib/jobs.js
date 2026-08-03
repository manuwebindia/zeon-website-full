import { getPrismaClient } from '@/lib/db';

export async function getApprovedJobs() {
  const prisma = getPrismaClient();
  return prisma.jobPosting.findMany({
    where: { status: 'approved' },
    orderBy: [{ approvedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      jobTitle: true,
      companyName: true,
      location: true,
      aboutCompany: true,
      skillsRequired: true,
      eligibility: true,
      jobTypes: true,
      shiftSchedule: true,
      approvedAt: true,
    },
  });
}

export function mapJobToVacancy(job) {
  const parts = [job.aboutCompany, job.skillsRequired, job.eligibility, job.jobTypes, job.shiftSchedule]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .filter(Boolean);

  return {
    id: job.id,
    title: job.jobTitle,
    company: job.companyName,
    location: job.location || 'Kerala',
    description: parts[0] || `${job.companyName} is hiring for ${job.jobTitle}.`,
  };
}
