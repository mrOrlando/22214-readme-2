import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceClient } from './service-client';
import { SendingResultResponse } from './types';

@Injectable()
export class NotificationClient extends ServiceClient {
  constructor(http: HttpService, config: ConfigService) {
    super(
      http,
      config.getOrThrow<string>('gateway.notificationServiceUrl'),
      'notification'
    );
  }

  public sendNewPublications(): Promise<SendingResultResponse> {
    return this.request('POST', '/notifications/send');
  }
}
