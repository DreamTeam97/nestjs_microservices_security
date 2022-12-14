import AppConfig from 'src/config/app.config';
import AuthConfig from 'src/config/auth.config';
import DatabaseConfig from 'src/config/database.config';
import HelperConfig from 'src/config/helper.config';
import UserConfig from './user.config';
import FileConfig from './file.config';
import MiddlewareConfig from './middleware.config';
import RabbitMQConfig from './rabbitmq.config';

export default [
  AppConfig,
  AuthConfig,
  DatabaseConfig,
  HelperConfig,
  UserConfig,
  MiddlewareConfig,
  FileConfig,
  RabbitMQConfig,
];
