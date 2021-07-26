import { ModuleMetadata, Type } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';

import { GeetestOptionsFactory } from './geetest-options-factory.interface';
import { GeetestOptions } from './geetest-options.interface';

export interface GeetestAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider['inject'];
  useExisting?: Type<GeetestOptionsFactory>;
  useClass?: Type<GeetestOptionsFactory>;
  useFactory?: (...args: unknown[]) => Promise<GeetestOptions> | GeetestOptions;
}
