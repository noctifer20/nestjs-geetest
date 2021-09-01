export interface GeetestModuleOptions {
  geetestId: string;
  geetestKey: string;

  bypassConfig?:
    | {
        url?: string;
        policy?: 'onDemand';
      }
    | {
        url?: string;
        policy: 'polling';
        frequency: number;
      };

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
  debug?: boolean;
}
