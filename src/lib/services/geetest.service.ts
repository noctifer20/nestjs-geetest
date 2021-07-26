//reference: https://github.com/GeeTeam/gt3-server-node-express-bypass/blob/master/sdk/geetest_lib.js

import * as Crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import { Inject, Logger } from '@nestjs/common';
import qs from 'qs';
import { lastValueFrom } from 'rxjs';

import { GEETEST_OPTIONS } from '../geetest.constants';
import { GeetestOptions } from '../interfaces/geetest-options.interface';
import { GeetestRegisterParamsInterface } from '../interfaces/geetest-register-params.interface';
import { GeetestRegisterResponseInterface } from '../interfaces/geetest-register-response.interface';
import { GeetestRegisterResultInterface } from '../interfaces/geetest-register-result.interface';
import { GeetestValidateResponseInterface } from '../interfaces/geetest-validate-response.interface';

export class GeetestService {
  static API_URL = 'http://api.geetest.com';
  static REGISTER_URL = '/register.php';
  static VALIDATE_URL = '/validate.php';
  static JSON_FORMAT = '1';
  static NEW_CAPTCHA = true;
  static HTTP_TIMEOUT_DEFAULT = 5000;
  static VERSION = 'node-express:3.1.1';
  static GEETEST_CHALLENGE = 'geetest_challenge';
  static GEETEST_VALIDATE = 'geetest_validate';
  static GEETEST_SECCODE = 'geetest_seccode';
  static GEETEST_SERVER_STATUS_SESSION_KEY = 'gt_server_status';

  constructor(
    @Inject(GEETEST_OPTIONS)
    private readonly geetestOptions: GeetestOptions,
    private logger: Logger,
    private httpService: HttpService
  ) {}

  public async register(params: GeetestRegisterParamsInterface) {
    this.log(`register(): 开始验证初始化, digestmod=${params.digestmod}.`);

    const originChallenge = await this.requestRegister(params);
    const libResult = this.buildRegisterResult(
      originChallenge,
      params.digestmod
    );

    this.log(`register(): 验证初始化, lib包返回信息=${libResult}.`);

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
      captchaid: this.geetestOptions.GEETEST_ID,
    });
    const validate_url = GeetestService.API_URL + GeetestService.VALIDATE_URL;

    this.log(
      `requestValidate(): 二次验证 正常模式, 向极验发送请求, url=${validate_url}, params=${JSON.stringify(
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
        `requestValidate(): 二次验证 正常模式, 与极验网络交互正常, 返回码=${
          response.status
        }, 返回body=${JSON.stringify(resBody)}.`
      );

      responseSeccode = resBody.seccode;
    } catch (e) {
      this.log('requestValidate(): 二次验证 正常模式, 请求异常, ' + e.message);
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
      `successValidate(): 开始二次验证 正常模式, challenge=${challenge}, validate=${validate}, seccode=${validate}.`
    );
    if (!this.checkParam(challenge, validate, seccode)) {
      return {
        status: 0,
        data: '',
        msg: '正常模式，本地校验，参数challenge、validate、seccode不可为空',
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
        msg: '请求极验validate接口失败',
      };
    } else if (responseSeccode === 'false') {
      return {
        status: 0,
        data: '',
        msg: '极验二次验证不通过',
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

  private static randomString(size = 21) {
    return Crypto.randomBytes(size).toString('base64').slice(0, size);
  }

  private static encode(
    str: string,
    encoding: GeetestRegisterParamsInterface['digestmod']
  ) {
    return Crypto.createHash(encoding).update(str).digest().toString('hex');
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
          gt: this.geetestOptions.GEETEST_ID,
          challenge: challenge,
          new_captcha: GeetestService.NEW_CAPTCHA,
        },
        msg: 'Get the bypass status in the current cache as fail, locally generate a challenge, and follow-up processes in downtime mode ',
      };
    } else {
      const challenge = GeetestService.encode(
        originChallenge + this.geetestOptions.GEETEST_KEY,
        digestmod
      );

      return {
        status: 1,
        data: {
          success: 1,
          gt: this.geetestOptions.GEETEST_ID,
          challenge: challenge,
          new_captcha: GeetestService.NEW_CAPTCHA,
        },
        msg: '',
      };
    }
  }

  private async requestRegister(params: GeetestRegisterParamsInterface) {
    const registerUrl = GeetestService.API_URL + GeetestService.REGISTER_URL;

    this.log(
      `requestRegister(): 验证初始化, 向极验发送请求, url=${registerUrl}, params=${JSON.stringify(
        params
      )}.`
    );

    let originChallenge;
    try {
      const request =
        this.httpService.request<GeetestRegisterResponseInterface>({
          url: registerUrl,
          method: 'GET',
          timeout: GeetestService.HTTP_TIMEOUT_DEFAULT,
          params,
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
    if (this.geetestOptions.DEBUG) {
      this.logger.debug(message);
    }
  }
}
