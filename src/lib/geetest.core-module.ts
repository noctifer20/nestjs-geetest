import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { GEETEST_OPTIONS } from './geetest.constants';
import { GeetestAsyncOptions } from './interfaces/geetest-async-options.interface';
import { GeetestOptionsFactory } from './interfaces/geetest-options-factory.interface';
import { GeetestOptions } from './interfaces/geetest-options.interface';
import { GeetestService } from './services/geetest.service';

@Global()
@Module({
  imports: [],
})
export class GeetestCoreModule {
  static forRoot(options: GeetestOptions): DynamicModule {
    return {
      module: GeetestCoreModule,
      providers: [
        {
          provide: GEETEST_OPTIONS,
          useValue: options,
        },
      ],
      exports: [GeetestService],
    };
  }
  static forRootAsync(options: GeetestAsyncOptions): DynamicModule {
    return {
      module: GeetestCoreModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    };
  }

  private static createAsyncProviders(
    options: GeetestAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provide: options.useClass!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: GeetestAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: GEETEST_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: GEETEST_OPTIONS,
      useFactory: async (optionsFactory: GeetestOptionsFactory) =>
        await optionsFactory.createGeetestOptions(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      inject: [options.useExisting || options.useClass!],
    };
  }
}
