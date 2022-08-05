import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CrawlerUrlDto {
  @IsNotEmpty()
  readonly url: string;
}
