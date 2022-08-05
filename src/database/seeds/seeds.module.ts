import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { CommandModule } from 'nestjs-command';
import { PermissionSeed } from 'src/database/seeds/permission.seed';
import { RoleSeed } from 'src/database/seeds/role.seed';
import { PermissionModule } from 'src/features/permission/permission.module';
import { RoleModule } from 'src/features/role/role.module';
@Module({
  imports: [CoreModule, CommandModule, PermissionModule, RoleModule],
  providers: [PermissionSeed, RoleSeed],
  exports: [],
})
export class SeedsModule {}
