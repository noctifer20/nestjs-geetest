import { Test, TestingModule } from '@nestjs/testing';
import test from 'ava';

import { GEETEST_OPTIONS } from '../geetest.constants';
import { GeetestModuleOptions } from '../interfaces';

import { GeetestOptionsProvider } from './geetest-options.provider';

let geetestOptionsProvider: GeetestOptionsProvider;

test.before(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: GEETEST_OPTIONS,
        useValue: {
          geetestId: 'GEETEST_ID',
          geetestKey: 'GEETEST_KEY',
        } as GeetestModuleOptions,
      },
      GeetestOptionsProvider,
    ],
  }).compile();

  geetestOptionsProvider = module.get<GeetestOptionsProvider>(
    GeetestOptionsProvider
  );
});

test('should be defined', (t) => {
  t.not(geetestOptionsProvider, undefined);
});

test('should export options with default values for bypass async flow', (t) => {
  t.deepEqual(geetestOptionsProvider.options, {
    geetestId: 'GEETEST_ID',
    geetestKey: 'GEETEST_KEY',
    bypassConfig: {
      url: 'https://bypass.geetest.com/v1/bypass_status.php',
      policy: 'onDemand',
    },
    apiServer: 'https://api.geetest.com',
    registerUrl: '/register.php',
    validateUrl: '/validate.php',
    jsonFormat: '1',
    httpTimeoutDefault: 5000,
    version: 'node-express:3.1.1',
    geetestChallengeKey: 'geetest_challenge',
    geetestValidateKey: 'geetest_validate',
    geetestSeccodeKey: 'geetest_seccode',
    debug: false,
  });
});

test('should export options with default values for bypass sync flow', async (t) => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: GEETEST_OPTIONS,
        useValue: {
          geetestId: 'GEETEST_ID',
          geetestKey: 'GEETEST_KEY',
          bypassConfig: {
            url: 'https://bypass.geetest.com/v1/bypass_status.php',
            policy: 'polling',
            frequency: 10000,
          },
        } as GeetestModuleOptions,
      },
      GeetestOptionsProvider,
    ],
  }).compile();

  geetestOptionsProvider = module.get<GeetestOptionsProvider>(
    GeetestOptionsProvider
  );
  t.deepEqual(geetestOptionsProvider.options, {
    geetestId: 'GEETEST_ID',
    geetestKey: 'GEETEST_KEY',
    bypassConfig: {
      url: 'https://bypass.geetest.com/v1/bypass_status.php',
      policy: 'polling',
      frequency: 10000,
    },
    apiServer: 'https://api.geetest.com',
    registerUrl: '/register.php',
    validateUrl: '/validate.php',
    jsonFormat: '1',
    httpTimeoutDefault: 5000,
    version: 'node-express:3.1.1',
    geetestChallengeKey: 'geetest_challenge',
    geetestValidateKey: 'geetest_validate',
    geetestSeccodeKey: 'geetest_seccode',
    debug: false,
  });
});
