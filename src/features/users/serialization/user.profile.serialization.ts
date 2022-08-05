import { Exclude, Transform, Type } from 'class-transformer';

export class UserProfileSerialization {
  @Type(() => String)
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly mobileNumber: string;

  @Exclude()
  readonly password: string;

  readonly passwordExpired: Date;

  @Exclude()
  readonly salt: string;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}
