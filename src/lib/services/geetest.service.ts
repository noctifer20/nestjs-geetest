//reference: https://github.com/GeeTeam/gt3-server-node-express-bypass/blob/master/sdk/geetest_lib.js

import * as Crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import qs from 'qs';
import { lastValueFrom } from 'rxjs';

import {
  GeetestRegisterParamsInterface,
  GeetestRegisterResponseInterface,
  GeetestRegisterResultInterface,
  GeetestValidateResponseInterface,
} from '../interfaces';
import { BypassStatusProvider, GeetestOptionsProvider } from '../providers';

@Injectable()
export class GeetestService {
  static JSON_FORMAT = '1';
  static NEW_CAPTCHA = true;
  static HTTP_TIMEOUT_DEFAULT = 5000;
  static VERSION = 'node-express:3.1.1';

  private readonly logger = new Logger();

  constructor(
    private readonly geetestOptionsProvider: GeetestOptionsProvider,
    private readonly httpService: HttpService,
    private readonly bypassStatusProvider: BypassStatusProvider
  ) {}

  private static randomString(size = 21) {
    return Crypto.randomBytes(size).toString('base64').slice(0, size);
  }

  private static encode(
    str: string,
    encoding: GeetestRegisterParamsInterface['digestmod']
  ) {
    return Crypto.createHash(encoding).update(str).digest().toString('hex');
  }

  public async register(params: GeetestRegisterParamsInterface) {
    this.log(
      `register(): digestmod=${params.digestmod} bypassStatus=${this.bypassStatusProvider.bypassStatus}`
    );

    if (this.bypassStatusProvider.bypassStatus === 'fail')
      return this.localRegister();

    const originChallenge = await this.requestRegister(params);
    const libResult = this.buildRegisterResult(
      originChallenge,
      params.digestmod
    );

    this.log(`register(): libResult=${JSON.stringify(libResult)}.`);

    return libResult;
  }

  async localRegister() {
    this.log('localRegister() ');
    const libResult = this.buildRegisterResult('', 'md5');
    this.log(`register(): libResult=${libResult}.`);
    return libResult;
  }

  async requestValidate(
    challenge: string,
    seccode: string,
    params: GeetestRegisterParamsInterface
  ) {
    params = Object.assign(params, {
      seccode: seccode,
      json_format: GeetestService.JSON_FORMAT,
      challenge: challenge,
      sdk: GeetestService.VERSION,
      captchaid: this.geetestOptionsProvider.options.GEETEST_ID,
    });
    const validate_url =
      this.geetestOptionsProvider.options.API_SERVER +
      this.geetestOptionsProvider.options.VALIDATE_URL;

    this.log(
      `requestValidate(): url=${validate_url}, params=${JSON.stringify(
        params
      )}.`
    );

    let responseSeccode;
    try {
      const request =
        this.httpService.request<GeetestValidateResponseInterface>({
          url: validate_url,
          method: 'POST',
          timeout: GeetestService.HTTP_TIMEOUT_DEFAULT,
          data: qs.stringify(params),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
      const response = await lastValueFrom(request);
      const resBody = response.status === 200 ? response.data : { seccode: '' };

      this.log(
        `requestValidate(): response.status=${
          response.status
        }, response.body=${JSON.stringify(resBody)}.`
      );

      responseSeccode = resBody.seccode;
    } catch (e) {
      this.log('requestValidate(): error, ' + e.message);
      responseSeccode = '';
    }
    return responseSeccode;
  }

  async successValidate(
    challenge: string,
    validate: string,
    seccode: string,
    params: GeetestRegisterParamsInterface
  ): Promise<GeetestRegisterResultInterface> {
    this.log(
      `successValidate(): challenge=${challenge}, validate=${validate}, seccode=${validate}.`
    );
    if (!this.checkParam(challenge, validate, seccode)) {
      return {
        status: 0,
        data: '',
        msg: 'challenge、validate、seccode',
      };
    }
    const responseSeccode = await this.requestValidate(
      challenge,
      seccode,
      params
    );
    if (!responseSeccode) {
      return {
        status: 0,
        data: '',
        msg: 'validate',
      };
    } else if (responseSeccode === 'false') {
      return {
        status: 0,
        data: '',
        msg: 'Failed to verify the seccode',
      };
    }
    return { status: 1, data: '', msg: '' };
  }

  private checkParam(challenge: string, validate: string, seccode: string) {
    return !(
      challenge == undefined ||
      challenge.trim() === '' ||
      validate == undefined ||
      validate.trim() === '' ||
      seccode == undefined ||
      seccode.trim() === ''
    );
  }

  private buildRegisterResult(
    originChallenge: string,
    digestmod: GeetestRegisterParamsInterface['digestmod']
  ): GeetestRegisterResultInterface {
    if (!originChallenge || originChallenge === '0') {
      const challenge = GeetestService.randomString(32).toLowerCase();

      return {
        status: 0,
        data: {
          success: 0,
          gt: this.geetestOptionsProvider.options.GEETEST_ID,
          challenge: challenge,
          new_captcha: GeetestService.NEW_CAPTCHA,
        },
        msg: 'Get the bypass status in the current cache as fail, locally generate a challenge, and follow-up processes in downtime mode ',
      };
    } else {
      const challenge = GeetestService.encode(
        originChallenge + this.geetestOptionsProvider.options.GEETEST_KEY,
        digestmod
      );

      return {
        status: 1,
        data: {
          success: 1,
          gt: this.geetestOptionsProvider.options.GEETEST_ID,
          challenge: challenge,
          new_captcha: GeetestService.NEW_CAPTCHA,
        },
        msg: '',
      };
    }
  }

  private async requestRegister(params: GeetestRegisterParamsInterface) {
    const registerUrl =
      this.geetestOptionsProvider.options.API_SERVER +
      this.geetestOptionsProvider.options.REGISTER_URL;

    this.log(
      `requestRegister(): url=${registerUrl}, params=${JSON.stringify(params)}.`
    );

    let originChallenge;
    try {
      const request =
        this.httpService.request<GeetestRegisterResponseInterface>({
          url: registerUrl,
          method: 'GET',
          timeout: GeetestService.HTTP_TIMEOUT_DEFAULT,
          params: {
            ...params,
            gt: this.geetestOptionsProvider.options.GEETEST_ID,
          },
        });

      const response = await lastValueFrom(request);

      const resBody =
        response.status === 200 ? response.data : { challenge: '' };

      this.log(
        `requestRegister(): Verify initialization, normal interaction with JiYi network, return code=${
          response.status
        }, responseBody=${JSON.stringify(resBody)}.`
      );

      originChallenge = resBody.challenge;
    } catch (e) {
      this.log(
        'requestRegister(): Verify initialization, request exception, follow-up process goes downtime, ' +
          e.message
      );
      originChallenge = '';
    }
    return originChallenge;
  }

  private log(message: string) {
    if (this.geetestOptionsProvider.options.DEBUG) {
      this.logger.debug(message);
    }
  }
}
