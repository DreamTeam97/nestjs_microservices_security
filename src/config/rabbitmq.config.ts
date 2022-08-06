import { registerAs } from '@nestjs/config';

export default registerAs(
  'rabbitmq',
  (): Record<string, any> => ({
    rb_url: process.env.RABBITMQ_URL,
    admission_queue: process.env.RABBITMQ_ADMISSION_QUEUE,
  }),
);
