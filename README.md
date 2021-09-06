# nestjs-geetest
NestJs library for [Geetest](https://docs.geetest.com/captcha/overview/start/) integration.
# Installation
To install just run
```shell
yarn add nestjs-geetest
```
or if you are using `npm`
```shell
npm install --save nestjs-geetest
```
# Usage
Import `GeetestModule` in your module and pass [configuration options](#Installation).
```typescript
// captcha.module.ts
import { GeetestModule } from 'nestjs-geetest';

@Module({
  imports: [
    GeetestModule.forRoot({
      geetestId: 'GEETEST_ID',
      geetestKey: 'GEETEST_KEY',
    }),
  ],
  controllers: [CaptchaController],
})
export class CaptchaModule {}
```
Or asynchronous usage:
```typescript
// captcha.module.ts
import { GeetestModule } from 'nestjs-geetest';


@Module({
  imports: [
    GeetestModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        geetestId: configService.get<string>('GEETEST_ID', ''),
        geetestKey: configService.get<string>('GEETEST_KEY', ''),
      }),
    }),
  ],
  controllers: [CaptchaController],
})
export class CaptchaModule {}
```
Then use `register` method from `GeetestService` and `GeetestVerifyGuard`  in controller

```typescript
// captcha.controller.ts

import { Post } from '@nestjs/common';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly geetestService: GeetestService) {
  }

  @Post('/register')
  register() {
    return this.geetestService.register();
  }
  
  @Post('/verify')
  @UseGuards(GeetestVerifyGuard)

  verify() {
    // do something
  }
}
```
