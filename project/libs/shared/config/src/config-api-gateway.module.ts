import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import apiGatewayConfig from './api-gateway.config';
import appConfig from './app.config';
import { getConfigModuleOptions } from './get-config-module-options';

// The env file is read when the module is registered, not when the file is
// imported, so that applications do not load env files of each other.
@Module({})
export class ConfigApiGatewayModule {
  public static register(): DynamicModule {
    return {
      module: ConfigApiGatewayModule,
      imports: [
        ConfigModule.forRoot(
          getConfigModuleOptions('api-gateway', [appConfig, apiGatewayConfig])
        ),
      ],
    };
  }
}
