import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { PermissionBulkService } from 'src/features/permission/service/permission.bulk.service';
import { ENUM_PERMISSIONS } from 'src/features/permission/permission.constant';

@Injectable()
export class PermissionSeed {
  constructor(private readonly permissionBulkService: PermissionBulkService) {}

  @Command({
    command: 'insert:permission',
    describe: 'insert permissions',
  })
  async insert(): Promise<void> {
    try {
      const permissions = Object.keys(ENUM_PERMISSIONS).map((val) => ({
        code: val,
        name: val.replace('_', ' '),
      }));
      console.log('zo');
      await this.permissionBulkService.createMany(permissions);
    } catch (e) {
      throw new Error(e.message);
    }

    return;
  }
}
