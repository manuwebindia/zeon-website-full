import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function createPrismaClient() {
  return new PrismaClient();
}

function hasJobPostingModel(client) {
  return Boolean(client?.jobPosting?.findMany);
}

export function getPrismaClient() {
  let client = globalForPrisma.prisma;

  if (!hasJobPostingModel(client)) {
    if (client && typeof client.$disconnect === 'function') {
      void client.$disconnect().catch(() => {});
    }

    globalForPrisma.prisma = undefined;
    client = createPrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client;
    }
  }

  return client;
}

/** Lazy proxy so hot reload never keeps a stale client missing new models. */
const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getPrismaClient();
      const value = client[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  }
);

export default prisma;
