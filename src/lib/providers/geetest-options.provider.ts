import { Inject, Injectable } from '@nestjs/common';

import { GEETEST_OPTIONS } from '../geetest.constants';
import { GeetestModuleOptions } from '../interfaces';

@Injectable()
export class GeetestOptionsProvider {
  public readonly options: Required<GeetestModuleOptions>;

  constructor(@Inject(GEETEST_OPTIONS) geetestOptions: GeetestModuleOptions) {
    this.options = {
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

      ...geetestOptions,
    };
  }
}
