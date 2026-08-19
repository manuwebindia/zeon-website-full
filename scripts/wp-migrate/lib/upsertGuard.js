async function assertCanImport(prisma, model, { wpPostId, slug }, options = {}) {
  const allowUpdate = options.allowUpdate ?? true;
  if (wpPostId) {
    const byWp = await prisma[model].findFirst({ where: { wpPostId } });
    if (byWp) {
      return allowUpdate
        ? { action: 'update', existing: byWp }
        : { action: 'skip', reason: 'already imported (use --update to refresh)', existing: byWp };
    }
  }

  const bySlug = await prisma[model].findUnique({ where: { slug } });
  if (bySlug) {
    if (bySlug.wpPostId && bySlug.wpPostId !== wpPostId) {
      return { action: 'skip', reason: 'slug owned by different wpPostId', existing: bySlug };
    }
    if (!bySlug.wpPostId) {
      return { action: 'skip', reason: 'manual admin content (no wpPostId)', existing: bySlug };
    }
    return allowUpdate
      ? { action: 'update', existing: bySlug }
      : { action: 'skip', reason: 'page already exists (use --update to refresh)', existing: bySlug };
  }

  return { action: 'create', existing: null };
}

module.exports = { assertCanImport };
