import { Injectable } from '@nestjs/common';
import { IPermission } from '../permission.interface';
import {
  PermissionDocument,
  PermissionEntity,
} from '../schema/permission.schema';
import { Model } from 'mongoose';
import { DatabaseEntity } from 'src/database/database.decorator';
@Injectable()
export class PermissionBulkService {
  constructor(
    @DatabaseEntity(PermissionEntity.name)
    private readonly databaseEntity: Model<PermissionDocument>,
  ) {}
  async createMany(data: IPermission[]) {
    this.databaseEntity.insertMany(
      data.map(({ isActive, code, description, name }) => ({
        code: code,
        name: name,
        description: description,
        isActive: isActive || true,
      })),
    );
  }
}
