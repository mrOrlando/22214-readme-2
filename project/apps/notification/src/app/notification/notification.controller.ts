import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { NotificationService } from './notification.service';
import { SendingResultRdo } from './rdo/sending-result.rdo';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary:
      'Send new publications since the last mailing to all subscribers. Meant to be called by a scheduler such as cron',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The mailing has been processed.',
    type: SendingResultRdo,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The previous mailing is still in progress.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('send')
  public async send(): Promise<SendingResultRdo> {
    const result = await this.notificationService.sendNewPublications();
    return fillDto(SendingResultRdo, result);
  }
}
