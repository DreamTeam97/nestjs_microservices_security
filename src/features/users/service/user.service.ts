import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  IUserDocument,
  IUserCreate,
  IUserUpdate,
  IUserCheckExist,
  IUserCreateWithGoogle,
} from 'src/features/users/user.interface';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseEntity } from 'src/database/database.decorator';
import { HelperStringService } from 'src/utils/helper/service/helper.string.service';
import { UserDocument, UserEntity } from '../schema/user.schema';
import { plainToInstance } from 'class-transformer';
import { UserProfileSerialization } from '../serialization/user.profile.serialization';
import { IDatabaseFindOneOptions } from 'src/database/database.interface';

@Injectable()
export class UserService {
  private readonly uploadPath: string;

  constructor(
    @DatabaseEntity(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
    private readonly helperStringService: HelperStringService,
    private readonly configService: ConfigService,
  ) {
    this.uploadPath = this.configService.get<string>('user.uploadPath');
  }

  async checkExist(email: string): Promise<IUserCheckExist> {
    const existEmail: Record<string, any> = await this.userModel.findOne({
      email,
    });
    return {
      email: existEmail ? true : false,
    };
  }

  async create({
    firstName,
    lastName,
    password,
    passwordExpired,
    salt,
    email,
    role,
  }: IUserCreate): Promise<UserDocument> {
    const user: UserEntity = {
      firstName,
      email,
      password,
      isActive: true,
      lastName: lastName || undefined,
      salt,
      passwordExpired,
      role: new Types.ObjectId(role),
      isRegisteredWithGoogle: false,
      avatar: '',
    };

    const create: UserDocument = new this.userModel(user);
    return create.save();
  }

  async findOneById<T>(_id: string): Promise<T> {
    const user = this.userModel.findById(_id);
    return user.lean();
  }

  async serializationProfile(
    data: IUserDocument,
  ): Promise<UserProfileSerialization> {
    return plainToInstance(UserProfileSerialization, data);
  }

  async findOne(
    find?: Record<string, any>,
    options?: IDatabaseFindOneOptions,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne(find);
    return user;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async createWithGoogle({
    firstName,
    lastName,
    email,
    role,
    avatar,
  }: IUserCreateWithGoogle) {
    const newUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      role,
      isRegisteredWithGoogle: true,
      avatar,
    });
    return newUser;
  }
}
