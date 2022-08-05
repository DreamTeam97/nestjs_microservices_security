import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { PermissionDocument } from 'src/features/permission/schema/permission.schema';
import { ENUM_PERMISSIONS } from 'src/features/permission/permission.constant';
import { PermissionService } from 'src/features/permission/service/permission.service';
import { RoleBulkService } from 'src/features/role/service/role.bulk.service';
import { RoleService } from 'src/features/role/service/role.service';
import { ENUM_ROLE_ACCESS_FOR } from 'src/features/role/role.constant';

@Injectable()
export class RoleSeed {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    private readonly roleBulkService: RoleBulkService,
  ) {}

  @Command({
    command: 'insert:role',
    describe: 'insert roles',
  })
  async insert(): Promise<void> {
    const permissions: PermissionDocument[] =
      await this.permissionService.findAll({
        code: { $in: Object.values(ENUM_PERMISSIONS) },
      });

    try {
      const permissionsMap = permissions.map((val) => val._id);
      await this.roleService.createSuperAdmin();
      await this.roleBulkService.createMany([
        {
          name: 'admin',
          permissions: permissionsMap,
          accessFor: ENUM_ROLE_ACCESS_FOR.ADMIN,
        },
        {
          name: 'user',
          permissions: [],
          accessFor: ENUM_ROLE_ACCESS_FOR.USER,
        },
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
    return;
  }
}
