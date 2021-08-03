export interface GeetestModuleOptions {
  GEETEST_ID: string;
  GEETEST_KEY: string;

  BYPASS_URL?: string;
  API_SERVER?: string;
  REGISTER_URL?: string;
  VALIDATE_URL?: string;
  JSON_FORMAT?: string;
  HTTP_TIMEOUT_DEFAULT?: number;
  VERSION?: string;
  GEETEST_CHALLENGE?: string;
  GEETEST_VALIDATE?: string;
  GEETEST_SECCODE?: string;
  GEETEST_SERVER_STATUS_SESSION_KEY?: string;
  DEBUG?: boolean;
}
