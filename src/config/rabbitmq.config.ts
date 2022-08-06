import { registerAs } from '@nestjs/config';

export default registerAs(
  'rabbitmq',
  (): Record<string, any> => ({
    rbUrl: process.env.RABBITMQ_URL,
    securityQueue: process.env.RABBITMQ_SECURITY_QUEUE,
  }),
);
