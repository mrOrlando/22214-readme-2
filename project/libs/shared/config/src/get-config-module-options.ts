import { ConfigModuleOptions } from '@nestjs/config';
import { resolve } from 'path';

// Options of the global config module of an application: its own env file
// (looked up from the workspace root or the application folder) and configs.
export function getConfigModuleOptions(
  app: string,
  load: NonNullable<ConfigModuleOptions['load']>
): ConfigModuleOptions {
  const envFile = `${app}.env`;

  return {
    isGlobal: true,
    cache: true,
    load,
    envFilePath: [
      `apps/${app}/${envFile}`,
      resolve(process.cwd(), `apps/${app}/${envFile}`),
      resolve(process.cwd(), envFile),
    ],
  };
}
