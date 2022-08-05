import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  IDatabaseFindAllOptions,
  IDatabaseFindOneOptions,
} from 'src/database/database.interface';
import { DatabaseEntity } from 'src/database/database.decorator';
import { RoleDocument, RoleEntity } from '../schema/role.schema';
import { ENUM_ROLE_ACCESS_FOR } from '../role.constant';
import { PermissionEntity } from 'src/features/permission/schema/permission.schema';

export class RoleService {
  constructor(
    @DatabaseEntity(RoleEntity.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  async findAll(
    find?: Record<string, any>,
    options?: IDatabaseFindAllOptions,
  ): Promise<RoleDocument[]> {
    const roles = this.roleModel.find(find);
    if (options && options.limit !== undefined && options.skip !== undefined) {
      roles.limit(options.limit).skip(options.skip);
    }

    if (options && options.sort) {
      roles.sort(options.sort);
    }

    return roles.lean();
  }

  async createSuperAdmin(): Promise<RoleDocument> {
    const create: RoleDocument = new this.roleModel({
      name: 'superadmin',
      permissions: [],
      isActive: true,
      accessFor: ENUM_ROLE_ACCESS_FOR.SUPER_ADMIN,
    });

    return create.save();
  }

  async findOne<T>(
    find?: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<T> {
    const role = this.roleModel.findOne(find);

    if (options && options.populate && options.populate.permission) {
      role.populate({
        path: 'permissions',
        model: PermissionEntity.name,
      });
    }

    return role.lean();
  }
}
