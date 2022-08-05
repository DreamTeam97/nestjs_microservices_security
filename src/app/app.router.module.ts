import { DynamicModule, Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RouterPublicModule } from 'src/router/router.public.module';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

@Module({})
export class AppRouterModule {
  static register(): DynamicModule {
    console.log('process.env.APP_HTTP_ON', process.env.APP_HTTP_ON);
    if (process.env.APP_HTTP_ON === 'true') {
      return {
        module: AppRouterModule,
        controllers: [AppController],
        providers: [AppService],
        exports: [],
        imports: [
          RouterPublicModule,
          // RouterModule.register([
          //   {
          //     path: '/',
          //     module: RouterPublicModule,
          //   },
          // ]),
        ],
      };
    }

    return {
      module: AppRouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports: [],
    };
  }
}
