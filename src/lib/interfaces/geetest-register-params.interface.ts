export interface GeetestRegisterParamsInterface {
  user_id?: string;
  client_type?: 'web' | 'h5' | 'native' | 'unknown';
  ip_address?: string;
  digestmod: 'md5' | 'sha256' | 'hmac-sha256';
  json_format: string;
  sdk: string;
}
