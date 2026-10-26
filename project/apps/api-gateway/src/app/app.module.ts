import { Module } from '@nestjs/common';
import { ConfigApiGatewayModule } from '@project/config';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { CommentsModule } from './comments/comments.module';
import { HealthModule } from './health/health.module';
import { LikesModule } from './likes/likes.module';
import { PostsModule } from './posts/posts.module';
import { ProfileModule } from './profile/profile.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigApiGatewayModule.register(),
    ClientsModule,
    UsersModule,
    AuthModule,
    PostsModule,
    ProfileModule,
    CommentsModule,
    LikesModule,
    TagsModule,
    HealthModule,
  ],
})
export class AppModule {}
