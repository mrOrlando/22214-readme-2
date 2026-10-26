import { Module } from '@nestjs/common';
import { ConfigFileServerModule } from '@project/config';
import { FileModule } from './file/file.module';

@Module({
  imports: [ConfigFileServerModule.register(), FileModule],
})
export class AppModule {}
