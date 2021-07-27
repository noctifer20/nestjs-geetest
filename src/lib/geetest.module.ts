import { DynamicModule, Module } from '@nestjs/common';

import { GeetestCoreModule } from './geetest.core-module';
import { GeetestAsyncOptions, GeetestOptions } from './interfaces';

@Module({})
export class GeetestModule {
  static forRoot(options: GeetestOptions): DynamicModule {
    return {
      module: GeetestModule,
      imports: [GeetestCoreModule.forRoot(options)],
      exports: [GeetestCoreModule],
    };
  }

  static forRootAsync(options: GeetestAsyncOptions): DynamicModule {
    return {
      module: GeetestModule,
      imports: [GeetestCoreModule.forRootAsync(options)],
      exports: [GeetestCoreModule],
    };
  }
}
