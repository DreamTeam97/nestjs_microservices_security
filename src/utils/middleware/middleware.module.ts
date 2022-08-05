import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { CorsMiddleware } from './cors/cors.middleware';
import {
  HtmlBodyParserMiddleware,
  JsonBodyParserMiddleware,
  RawBodyParserMiddleware,
  TextBodyParserMiddleware,
  UrlencodedBodyParserMiddleware,
} from './body-parser/body-parser.middleware';
import {
  HttpDebuggerMiddleware,
  HttpDebuggerResponseMiddleware,
} from './http-debugger/http-debugger.middleware';
import { HelmetMiddleware } from './helmet/helmet.middleware';
import { RateLimitMiddleware } from './rate-limit/rate-limit.middleware';
import { UserAgentMiddleware } from './user-agent/user-agent.middleware';
import { CompressionMiddleware } from './compression/compression.middleware';
import { RequestIdMiddleware } from './request-id/request-id.middleware';
import { TimezoneMiddleware } from './timezone/timezone.middleware';
import { ResponseTimeMiddleware } from './response-time/response-time.middleware';
import { TimestampMiddleware } from './timestamp/timestamp.middleware';
import LogsMiddleware from './logs/logs.middleware';
@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        RequestIdMiddleware,
        TimezoneMiddleware,
        JsonBodyParserMiddleware,
        RawBodyParserMiddleware,
        HtmlBodyParserMiddleware,
        TextBodyParserMiddleware,
        UrlencodedBodyParserMiddleware,
        CompressionMiddleware,
        CorsMiddleware,
        HttpDebuggerResponseMiddleware,
        HttpDebuggerMiddleware,
        HelmetMiddleware,
        RateLimitMiddleware,
        UserAgentMiddleware,
        ResponseTimeMiddleware,
        TimestampMiddleware,
        LogsMiddleware,
      )
      .forRoutes('*');
  }
}
