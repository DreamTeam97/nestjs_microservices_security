import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthService } from './service/auth.service';

@Module({
  controllers: [],
  providers: [AuthService],
  imports: [],
  exports: [AuthService],
})
export class AuthenticationModule {}
