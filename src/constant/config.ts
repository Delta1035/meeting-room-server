class Config {
  readonly REDIS_SERVER_HOST = 'redis_server_host';
  readonly REDIS_SERVER_PORT = 'redis_server_port';
  readonly REDIS_SERVER_DB = 'redis_server_db';
  readonly REDIS_SERVER_PASSWORD = 'redis_server_password';

  readonly NODEMAILER_HOST = 'nodemailer_host';
  readonly NODEMAILER_PORT = 'nodemailer_port';
  readonly NODEMAILER_USER = 'nodemailer_auto_user';
  readonly NODEMAILER_PASS = 'nodemailer_auto_pass';

  readonly NEST_SERVER_PORT = 'nest_server_port';

  readonly MYSQL_SERVER_HOST = 'mysql_server_host';
  readonly MYSQL_SERVER_PORT = 'mysql_server_port';
  readonly MYSQL_SERVER_USERNAME = 'mysql_server_username';
  readonly MYSQL_SERVER_PASSWORD = 'mysql_server_password';
  readonly MYSQL_SERVER_DATABASE = 'mysql_server_database';

  readonly JWT_SECRET = 'jwt_secret';
  readonly JWT_ACCESS_TOKEN_EXPIRES_TIME = 'jwt_access_token_expires_time';
  readonly JWT_REFRESH_TOKEN_EXPIRES_TIME = 'jwt_refresh_token_expires_time';
}

export const config = new Config();
