import { GeetestOptions } from './geetest-options.interface';

export interface GeetestOptionsFactory {
  createGeetestOptions(): Promise<GeetestOptions> | GeetestOptions;
}
