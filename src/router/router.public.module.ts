import { Module } from '@nestjs/common';
import { AuthenticationController } from 'src/authentication/authentication.controller';
import { CrawlerController } from 'src/features/crawler/crawler.controller';
import { UserModule } from 'src/features/users/user.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { RoleModule } from 'src/features/role/role.module';
@Module({
  controllers: [AuthenticationController, CrawlerController],
  providers: [],
  exports: [],
  imports: [UserModule, AuthenticationModule, RoleModule],
})
export class RouterPublicModule {}
