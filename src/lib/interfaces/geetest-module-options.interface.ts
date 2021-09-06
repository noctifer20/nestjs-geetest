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

  apiServer?: string;
  registerUrl?: string;
  validateUrl?: string;

  httpTimeoutDefault?: number;

  jsonFormat?: string;
  version?: string;

  geetestChallengeKey?: string;
  geetestValidateKey?: string;
  geetestSeccodeKey?: string;
  debug?: boolean;
}
