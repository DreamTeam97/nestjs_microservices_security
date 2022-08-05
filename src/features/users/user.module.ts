import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDatabaseName, UserEntity, UserSchema } from './schema/user.schema';
import { UserService } from './service/user.service';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: UserEntity.name,
          schema: UserSchema,
          collection: UserDatabaseName,
        },
      ],
      DATABASE_CONNECTION_NAME,
    ),
  ],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
