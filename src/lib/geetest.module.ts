import { DynamicModule, Module } from '@nestjs/common';

import { GeetestCoreModule } from './geetest.core-module';
import { GeetestAsyncOptions } from './interfaces/geetest-async-options.interface';
import { GeetestOptions } from './interfaces/geetest-options.interface';

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
