import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { v4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: NextFunction): Promise<void> {
    const uuid: string = v4();
    req.headers['x-request-id'] = uuid;
    req.id = uuid;
    next();
  }
}
