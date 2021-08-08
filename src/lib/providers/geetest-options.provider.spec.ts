import { Test, TestingModule } from '@nestjs/testing';
import test from 'ava';

import { GEETEST_OPTIONS } from '../geetest.constants';

import { GeetestOptionsProvider } from './geetest-options.provider';

let geetestOptionsProvider: GeetestOptionsProvider;

test.before(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      {
        provide: GEETEST_OPTIONS,
        useValue: {
          GEETEST_ID: 'GEETEST_ID',
          GEETEST_KEY: 'GEETEST_KEY',
        },
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

test('should export options with default values', (t) => {
  t.deepEqual(geetestOptionsProvider.options, {
    GEETEST_ID: 'GEETEST_ID',
    GEETEST_KEY: 'GEETEST_KEY',
    BYPASS_URL: 'https://bypass.geetest.com/v1/bypass_status.php',
    API_SERVER: 'https://api.geetest.com',
    REGISTER_URL: '/register.php',
    VALIDATE_URL: '/validate.php',
    JSON_FORMAT: '1',
    HTTP_TIMEOUT_DEFAULT: 5000,
    VERSION: 'node-express:3.1.1',
    GEETEST_CHALLENGE: 'geetest_challenge',
    GEETEST_VALIDATE: 'geetest_validate',
    GEETEST_SECCODE: 'geetest_seccode',
    GEETEST_SERVER_STATUS_SESSION_KEY: 'gt_server_status',
    DEBUG: false,
  });
});
