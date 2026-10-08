import 'dotenv/config';
import { prismaClient, PrismaClient } from '../src/prisma-client';
import { PostType } from '../src/generated/prisma/enums';

const FIRST_TAG_UUID = '39614113-7ad5-45b6-8093-06455437e1e2';
const SECOND_TAG_UUID = 'efd775e2-df55-4e0e-a308-58249f5ea202';

const FIRST_POST_UUID = '6d308040-96a2-4162-bea6-2338e9976540';
const SECOND_POST_UUID = 'ab04593b-da99-4fe3-8b4b-e06d82e2efdd';
const THIRD_POST_UUID = '3f0a3a5c-6c1e-4a57-9d0b-7c1f8a2f4b11';
const FOURTH_POST_UUID = '8b1d6e42-2f7a-4c39-a5e4-0d9c6b3e7f22';
const FIFTH_POST_UUID = 'c4e9a7d1-5b3f-4e86-b2a8-1f6d0c9e8a33';
const SIXTH_POST_UUID = 'e7c2b5f8-9a4d-4b13-8c6e-2a5f1d0b9c44';

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
      type: PostType.text,
      title: 'Thinner: a horror novel worth reading',
      userId: FIRST_USER_ID,
      text: 'I recently read the horror novel "Thinner". The story of a lawyer cursed to lose weight keeps you tense until the very last page.',
      announcement:
        "In my opinion, it is one of Stephen King's scariest and most underrated novels.",
      tags: {
        connect: [{ id: FIRST_TAG_UUID }],
      },
    },
    {
      id: SECOND_POST_UUID,
      type: PostType.text,
      title: "You Don't Know JavaScript: a review",
      userId: FIRST_USER_ID,
      text: 'A useful series of books on JavaScript. It explains scopes, closures, prototypes and asynchrony much deeper than most tutorials do.',
      announcement:
        'Secrets and hidden knowledge of JavaScript that every developer should know.',
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
    {
      id: THIRD_POST_UUID,
      type: PostType.video,
      title: 'NestJS in 100 seconds: a quick overview',
      videoUrl: 'https://www.youtube.com/watch?v=0M8AYU_hPas',
      userId: SECOND_USER_ID,
      tags: {
        connect: [{ id: SECOND_TAG_UUID }],
      },
    },
    {
      id: FOURTH_POST_UUID,
      type: PostType.quote,
      quoteText: 'Programs must be written for people to read.',
      quoteAuthor: 'Harold Abelson',
      userId: SECOND_USER_ID,
      tags: {
        connect: [{ id: SECOND_TAG_UUID }],
      },
    },
    {
      id: FIFTH_POST_UUID,
      type: PostType.link,
      linkUrl: 'https://www.prisma.io/docs',
      linkDescription: 'Prisma ORM documentation',
      userId: FIRST_USER_ID,
    },
    {
      id: SIXTH_POST_UUID,
      type: PostType.photo,
      photo: '/uploads/bookshelf.jpg',
      userId: FIRST_USER_ID,
      tags: {
        connect: [{ id: FIRST_TAG_UUID }],
      },
    },
  ];
}

function getLikes() {
  return [
    { postId: FIRST_POST_UUID, userId: SECOND_USER_ID },
    { postId: THIRD_POST_UUID, userId: FIRST_USER_ID },
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
  for (const { comments, ...post } of mockPosts) {
    await prismaClient.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        ...post,
        comments: comments
          ? {
              create: comments,
            }
          : undefined,
      },
    });
  }

  const mockLikes = getLikes();
  for (const like of mockLikes) {
    await prismaClient.like.upsert({
      where: { postId_userId: like },
      update: {},
      create: like,
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
