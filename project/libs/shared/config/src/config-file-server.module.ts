import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import fileConfig from './file.config';
import { getConfigModuleOptions } from './get-config-module-options';

// The env file is read when the module is registered, not when the file is
// imported, so that applications do not load env files of each other.
@Module({})
export class ConfigFileServerModule {
  public static register(): DynamicModule {
    return {
      module: ConfigFileServerModule,
      imports: [
        ConfigModule.forRoot(
          getConfigModuleOptions('file-server', [appConfig, fileConfig])
        ),
      ],
    };
  }
}
