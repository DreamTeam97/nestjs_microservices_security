import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { RoleEntity } from 'src/features/role/schema/role.schema';

@Schema({ timestamps: true, versionKey: false })
export class UserEntity {
  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  firstName: string;

  @Prop({
    required: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  lastName: string;

  @Prop({
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  passwordExpired: Date;

  @Prop()
  salt: string;

  @Prop()
  avatar: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: RoleEntity.name,
  })
  role: Types.ObjectId;

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: false,
  })
  isRegisteredWithGoogle: boolean;
}

export const UserDatabaseName = 'users';
export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = UserEntity & Document;

// Hooks
UserSchema.pre<UserDocument>('save', function (next) {
  this.email = this.email.toLowerCase();
  this.firstName = this.firstName.toLowerCase();

  if (this.lastName) {
    this.lastName = this.lastName.toLowerCase();
  }
  next();
});
