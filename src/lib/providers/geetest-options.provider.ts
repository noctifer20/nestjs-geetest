import { Inject, Injectable } from '@nestjs/common';

import { GEETEST_OPTIONS } from '../geetest.constants';
import { GeetestModuleOptions } from '../interfaces';

@Injectable()
export class GeetestOptionsProvider {
  public readonly options: Required<GeetestModuleOptions>;

  constructor(@Inject(GEETEST_OPTIONS) geetestOptions: GeetestModuleOptions) {
    this.options = {
      bypassConfig: {
        url: 'https://bypass.geetest.com/v1/bypass_status.php',
        policy: 'onDemand',
        ...(geetestOptions.bypassConfig ?? {}),
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

      ...geetestOptions,
    };
  }
}
