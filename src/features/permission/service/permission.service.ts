import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { DatabaseEntity } from 'src/database/database.decorator';
import { IDatabaseFindAllOptions } from 'src/database/database.interface';
import {
  PermissionDocument,
  PermissionEntity,
} from '../schema/permission.schema';

@Injectable()
export class PermissionService {
  constructor(
    @DatabaseEntity(PermissionEntity.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<PermissionDocument[]> {
    const findAll = this.permissionModel.find(find);
    if (options && options.limit !== undefined && options.skip !== undefined) {
      findAll.limit(options.limit).skip(options.skip);
    }

    if (options && options.sort) {
      findAll.sort(options.sort);
    }

    return findAll.lean();
  }
}
