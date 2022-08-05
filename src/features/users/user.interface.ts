import { IRoleDocument } from 'src/features/role/role.interface';
import { UserDocument } from './schema/user.schema';

export type IUserDocument = UserDocument;

export interface IUserCreate {
  firstName: string;
  lastName: string;
  password: string;
  passwordExpired: Date;
  email: string;
  salt: string;
  role: string;
}

export type IUserUpdate = Pick<IUserCreate, 'firstName' | 'lastName'>;

export interface IUserCheckExist {
  email: boolean;
}

export interface IUserCreateWithGoogle {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string;
}
