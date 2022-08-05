import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import userAgentParser from 'ua-parser-js';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: any, res: Response, next: NextFunction): void {
    const mode: string = this.configService.get<string>('app.mode');

    if (mode === 'secure') {
      // Put your specific user agent
      const userAgent: string = req.headers['user-agent'] as string;
      if (!userAgent) {
        throw new ForbiddenException({
          statusCode: 5983,
          message: 'middleware.error.userAgentInvalid',
        });
      }
    }
    req.userAgent = userAgentParser(req.headers['user-agent']);
    next();
  }
}
