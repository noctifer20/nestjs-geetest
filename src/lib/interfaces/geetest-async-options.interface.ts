import { ModuleMetadata, Type } from '@nestjs/common';

import { GeetestOptionsFactory } from './geetest-options-factory.interface';
import { GeetestOptions } from './geetest-options.interface';

export interface GeetestAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<GeetestOptionsFactory>;
  useClass?: Type<GeetestOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<GeetestOptions> | GeetestOptions;
}
