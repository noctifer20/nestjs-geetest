import { GeetestModuleOptions } from './geetest-module-options.interface';

export interface GeetestOptionsFactory {
  createGeetestOptions(): Promise<GeetestModuleOptions> | GeetestModuleOptions;
}
