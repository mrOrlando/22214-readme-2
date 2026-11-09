import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogClient } from '../clients/blog.client';
import { FileServerClient } from '../clients/file-server.client';
import { NotificationClient } from '../clients/notification.client';
import { UserClient } from '../clients/user.client';
import { HealthRdo } from './health.rdo';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly userClient: UserClient,
    private readonly blogClient: BlogClient,
    private readonly fileServerClient: FileServerClient,
    private readonly notificationClient: NotificationClient
  ) {}

  @ApiOperation({ summary: 'Check that the services answer' })
  @ApiResponse({ status: HttpStatus.OK, type: HealthRdo })
  @Get('/')
  public async check(): Promise<HealthRdo> {
    const [user, blog, fileServer, notification] = await Promise.all([
      this.userClient.isAvailable(),
      this.blogClient.isAvailable(),
      this.fileServerClient.isAvailable(),
      this.notificationClient.isAvailable(),
    ]);

    const services = { user, blog, fileServer, notification };

    return {
      status: Object.values(services).every(Boolean) ? 'ok' : 'degraded',
      services,
    };
  }
}
