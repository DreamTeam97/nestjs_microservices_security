import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configs from 'src/config/index';
import { WinstonModule } from 'nest-winston';
import { DebuggerOptionService } from 'src/debugger/service/debugger.option.service';
import { DebuggerModule } from 'src/debugger/debugger.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseOptionsService } from 'src/database/service/database.options.service';
import { DatabaseModule } from 'src/database/database.module';
import { DATABASE_CONNECTION_NAME } from 'src/database/database.constant';
import { HelperModule } from 'src/utils/helper/helper.module';
import { MiddlewareModule } from 'src/utils/middleware/middleware.module';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),
    WinstonModule.forRootAsync({
      inject: [DebuggerOptionService],
      imports: [DebuggerModule],
      useFactory: (debuggerOptionsService: DebuggerOptionService) =>
        debuggerOptionsService.createLogger(),
    }),
    MongooseModule.forRootAsync({
      connectionName: DATABASE_CONNECTION_NAME,
      inject: [DatabaseOptionsService],
      imports: [DatabaseModule],
      useFactory: (databaseOptionsService: DatabaseOptionsService) =>
        databaseOptionsService.createMongooseOptions(),
    }),
    HelperModule,
    DebuggerModule,
    MiddlewareModule,
    CacheModule,
  ],
})
export class CoreModule {}
