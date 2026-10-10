import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import rabbitConfig from './rabbit.config';

const ENV_BLOG_FILE_PATHS = [
  'apps/blog/blog.env',
  resolve(process.cwd(), 'apps/blog/blog.env'),
  resolve(process.cwd(), 'blog.env'),
];

// The env file is read when the module is registered, not when the file is
// imported, so that applications do not load env files of each other.
@Module({})
export class ConfigBlogModule {
  public static register(): DynamicModule {
    return {
      module: ConfigBlogModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: [rabbitConfig],
          envFilePath: ENV_BLOG_FILE_PATHS,
        }),
      ],
    };
  }
}
