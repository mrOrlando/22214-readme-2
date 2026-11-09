import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { REQUEST_TIMEOUT_MS } from './clients.constants';
import { BlogClient } from './blog.client';
import { FileServerClient } from './file-server.client';
import { NotificationClient } from './notification.client';
import { UserClient } from './user.client';

@Module({
  imports: [
    HttpModule.register({
      timeout: REQUEST_TIMEOUT_MS,
      // Redirects are not expected from the services
      maxRedirects: 0,
    }),
  ],
  providers: [UserClient, BlogClient, FileServerClient, NotificationClient],
  exports: [UserClient, BlogClient, FileServerClient, NotificationClient],
})
export class ClientsModule {}
