export interface GeetestRegisterResultInterface {
  status: number;
  data:
    | {
        success: number;
        gt: string;
        challenge: string;
        new_captcha: boolean;
      }
    | '';
  msg: string;
}
