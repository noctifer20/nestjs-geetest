import { ModuleMetadata, Type } from '@nestjs/common';
import { FactoryProvider } from '@nestjs/common/interfaces/modules/provider.interface';

import { GeetestModuleOptions } from './geetest-module-options.interface';
import { GeetestOptionsFactory } from './geetest-options-factory.interface';

export interface GeetestModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider['inject'];
  useExisting?: Type<GeetestOptionsFactory>;
  useClass?: Type<GeetestOptionsFactory>;
  useFactory?: (...args: unknown[]) => Promise<GeetestModuleOptions> | GeetestModuleOptions;
}
