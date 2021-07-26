export interface GeetestRegisterParamsInterface {
  user_id?: string;
  client_type?: 'web' | 'h5' | 'native' | 'unknown';
  ip_address?: string;
  digestmod: 'md5' | 'sha256' | 'hmac-sha256';
  gt: string;
  json_format: string;
  sdk: string;
}
