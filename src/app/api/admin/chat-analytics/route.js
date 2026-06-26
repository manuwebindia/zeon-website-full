import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requirePermission } from '@/lib/auth';

// GET /api/admin/chat-analytics
// Requires: chat-analytics.view
// Returns aggregated session statistics for the admin analytics dashboard.
export async function GET(request) {
  try {
    const user = requirePermission(request, 'chat-analytics.view');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // ── Total sessions and messages (last 30 days) ────────────────────────
    const [sessionAggregate, totalSessions] = await Promise.all([
      prisma.chatSession.aggregate({
        _sum: { messageCount: true },
        _count: { id: true },
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.chatSession.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
    ]);

    const totalMessages = sessionAggregate._sum.messageCount ?? 0;
    const avgMessagesPerSession =
      totalSessions > 0
        ? Math.round((totalMessages / totalSessions) * 10) / 10
        : 0;

    // ── Top 10 first questions (last 30 days) ─────────────────────────────
    // Prisma groupBy to aggregate by firstQuestion
    const questionGroups = await prisma.chatSession.groupBy({
      by: ['firstQuestion'],
      _count: { firstQuestion: true },
      where: {
        createdAt: { gte: thirtyDaysAgo },
        firstQuestion: { not: null },
      },
      orderBy: { _count: { firstQuestion: 'desc' } },
      take: 50, // fetch more to allow for dedup after normalisation
    });

    // Normalise (trim + lowercase) and re-aggregate for deduplication
    const questionMap = new Map();
    for (const g of questionGroups) {
      if (!g.firstQuestion) continue;
      const normalised = g.firstQuestion.trim().toLowerCase();
      if (!normalised) continue;
      const displayText = g.firstQuestion.trim(); // keep original case for display
      const existing = questionMap.get(normalised);
      if (existing) {
        existing.count += g._count.firstQuestion;
      } else {
        questionMap.set(normalised, {
          question: displayText,
          count: g._count.firstQuestion,
        });
      }
    }
    const topQuestions = [...questionMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ── Sessions per day (last 14 days) ──────────────────────────────────
    // Build date buckets for the last 14 days
    const dateBuckets = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dateBuckets.push(d.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
    }

    const sessionsInRange = await prisma.chatSession.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { createdAt: true },
    });

    // Group by date
    const dayCounts = {};
    for (const s of sessionsInRange) {
      const dateKey = s.createdAt.toISOString().slice(0, 10);
      dayCounts[dateKey] = (dayCounts[dateKey] ?? 0) + 1;
    }
    const sessionsPerDay = dateBuckets.map((date) => ({
      date,
      count: dayCounts[date] ?? 0,
    }));

    // ── Active today ──────────────────────────────────────────────────────
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const activeToday = await prisma.chatSession.count({
      where: { lastMessageAt: { gte: todayStart } },
    });

    return NextResponse.json({
      totalSessions,
      totalMessages,
      avgMessagesPerSession,
      activeToday,
      topQuestions,
      sessionsPerDay,
    });
  } catch (err) {
    console.error('[admin/chat-analytics] GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
