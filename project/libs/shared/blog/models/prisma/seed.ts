import 'dotenv/config';
import { prismaClient, PrismaClient } from '../src/prisma-client';

const FIRST_TAG_UUID = '39614113-7ad5-45b6-8093-06455437e1e2';
const SECOND_TAG_UUID = 'efd775e2-df55-4e0e-a308-58249f5ea202';

const FIRST_POST_UUID = '6d308040-96a2-4162-bea6-2338e9976540';
const SECOND_POST_UUID = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';

const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';

function getTags() {
  return [
    { id: FIRST_TAG_UUID, title: 'books' },
    { id: SECOND_TAG_UUID, title: 'computers' },
  ];
}

function getPosts() {
  return [
    {
      id: FIRST_POST_UUID,
      title: 'Thinner',
      userId: FIRST_USER_ID,
      content: 'I recently read the horror novel "Thinner".',
      description:
        "In my opinion, it is one of Stephen King's scariest novels.",
      tags: {
        connect: [{ id: FIRST_TAG_UUID }],
      },
    },
    {
      id: SECOND_POST_UUID,
      title: "You Don't Know JavaScript",
      userId: FIRST_USER_ID,
      content: 'A useful book on JavaScript',
      description: 'Secrets and hidden knowledge of JavaScript.',
      tags: {
        connect: [{ id: FIRST_TAG_UUID }, { id: SECOND_TAG_UUID }],
      },
      comments: [
        {
          message: 'This is really a great book!',
          userId: FIRST_USER_ID,
        },
        {
          message: 'Will definitely need to reread. Too much information.',
          userId: SECOND_USER_ID,
        },
      ],
    },
  ];
}

async function seedDb(prismaClient: PrismaClient) {
  const mockTags = getTags();
  for (const tag of mockTags) {
    await prismaClient.tag.upsert({
      where: { id: tag.id },
      update: {},
      create: {
        id: tag.id,
        title: tag.title,
      },
    });
  }

  const mockPosts = getPosts();
  for (const post of mockPosts) {
    await prismaClient.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        description: post.description,
        content: post.content,
        tags: post.tags,
        userId: post.userId,
        comments: post.comments
          ? {
              create: post.comments,
            }
          : undefined,
      },
    });
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
