import { DynamicModule, Module } from '@nestjs/common';

import { GeetestCoreModule } from './geetest.core-module';
import { GeetestModuleAsyncOptions, GeetestModuleOptions } from './interfaces';

@Module({})
export class GeetestModule {
  static forRoot(options: GeetestModuleOptions): DynamicModule {
    return {
      module: GeetestModule,
      imports: [GeetestCoreModule.forRoot(options)],
      exports: [GeetestCoreModule],
    };
  }

  static forRootAsync(options: GeetestModuleAsyncOptions): DynamicModule {
    return {
      module: GeetestModule,
      imports: [GeetestCoreModule.forRootAsync(options)],
      exports: [GeetestCoreModule],
    };
  }
}
