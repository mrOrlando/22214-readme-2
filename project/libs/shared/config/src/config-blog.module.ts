import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitConfig from './rabbit.config';
import { getConfigModuleOptions } from './get-config-module-options';

// The env file is read when the module is registered, not when the file is
// imported, so that applications do not load env files of each other.
@Module({})
export class ConfigBlogModule {
  public static register(): DynamicModule {
    return {
      module: ConfigBlogModule,
      imports: [
        ConfigModule.forRoot(getConfigModuleOptions('blog', [rabbitConfig])),
      ],
    };
  }
}
