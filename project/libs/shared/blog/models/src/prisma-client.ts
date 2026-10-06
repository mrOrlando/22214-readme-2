import { config } from 'dotenv';
import { resolve } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';

config({
  path: resolve(__dirname, '..', '..', '..', '..', '..', '.env'),
});
config();
import { PrismaClient } from './generated/prisma/client';

const connectionString = `${globalThis.process.env.DATABASE_URL}`;

if (!connectionString) {
  throw new Error('prisma-client.ts: DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

export { adapter, prismaClient, PrismaClient };
