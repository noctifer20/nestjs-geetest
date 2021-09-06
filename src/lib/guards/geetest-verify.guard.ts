import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { GeetestOptionsProvider } from '../providers';
import { GeetestService } from '../services';

@Injectable()
export class GeetestVerifyGuard implements CanActivate {
  constructor(
    private readonly geetestService: GeetestService,
    private readonly geetestOptionsProvider: GeetestOptionsProvider
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ body: never }>();

    const geetestChallenge =
      request.body[this.geetestOptionsProvider.options.geetestChallengeKey];
    const geetestValidate =
      request.body[this.geetestOptionsProvider.options.geetestValidateKey];
    const geetestSeccode =
      request.body[this.geetestOptionsProvider.options.geetestSeccodeKey];

    if (!geetestChallenge || !geetestValidate || !geetestSeccode) return false;

    const result = await this.geetestService.validate(
      geetestChallenge,
      geetestValidate,
      geetestSeccode
    );

    return !!result.status;
  }
}
