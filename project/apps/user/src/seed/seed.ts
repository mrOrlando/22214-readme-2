import { config } from 'dotenv';
import { resolve } from 'node:path';
import bcrypt from 'bcrypt';
import mongoose, { Schema, Types } from 'mongoose';
import { getMongoConnectionString } from '@project/helpers';
import { UserRole } from '@project/types';
import { SALT_ROUNDS } from '../app/user/user.constants';

config({
  path: resolve(__dirname, '..', '..', 'user.env'),
});

// The same ids are used as post authors in the blog seed
const FIRST_USER_ID = '658170cbb954e9f5b905ccf4';
const SECOND_USER_ID = '6581762309c030b503e30512';
const THIRD_USER_ID = '65817a1f09c030b503e30519';

const MOCK_PASSWORD = '123456';

const UserSeedModel = mongoose.model(
  'UserSeed',
  new Schema(
    {
      name: String,
      email: { type: String, required: true, unique: true },
      passwordHash: String,
      role: { type: String, enum: Object.values(UserRole) },
    },
    { timestamps: true, collection: 'users' }
  )
);

function getUsers() {
  return [
    {
      id: FIRST_USER_ID,
      name: 'Keks Academy',
      email: 'keks@readme.local',
      role: UserRole.Admin,
    },
    {
      id: SECOND_USER_ID,
      name: 'Ivan Petrov',
      email: 'ivan@readme.local',
      role: UserRole.User,
    },
    {
      id: THIRD_USER_ID,
      name: 'Anna Smirnova',
      email: 'anna@readme.local',
      role: UserRole.User,
    },
  ];
}

function getConnectionString(): string {
  const { env } = globalThis.process;

  return getMongoConnectionString({
    username: `${env.MONGO_USER}`,
    password: `${env.MONGO_PASSWORD}`,
    host: `${env.MONGO_HOST}`,
    port: `${env.MONGO_PORT}`,
    databaseName: `${env.MONGO_DB}`,
    authDatabase: `${env.MONGO_AUTH_BASE}`,
  });
}

async function seedDb() {
  const passwordHash = await bcrypt.hash(MOCK_PASSWORD, SALT_ROUNDS);

  for (const { id, ...user } of getUsers()) {
    await UserSeedModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $setOnInsert: { ...user, passwordHash } },
      { upsert: true }
    );
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  try {
    await mongoose.connect(getConnectionString());
    await seedDb();
    await mongoose.disconnect();
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    await mongoose.disconnect();
    globalThis.process.exit(1);
  }
}

bootstrap();
