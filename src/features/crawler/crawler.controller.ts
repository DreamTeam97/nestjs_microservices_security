import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerUrlDto } from './dto/crawler.dto';
import { HelperCrawlerService } from 'src/utils/helper/service/helper.crawler.service';
@Controller()
export class CrawlerController {
  constructor(private readonly helperCrawler: HelperCrawlerService) {}
  @Post('/crawler')
  async crawler(@Body() body: CrawlerUrlDto) {
    console.log('body.url', body.url);
    const $ = await this.helperCrawler.fetchHtmlFromUrl(body.url);
    const mainContent = $('#main-content');
    const bodyData = $('body');
    bodyData.children('header').prevAll().remove();
    bodyData.children('footer').nextAll().remove();
    const headersTag = mainContent.find('header:first').text();
    bodyData.map((_, element) => {
      const $content = $(element);
      console.log($content.text());
    });
    return {
      message: 'ok',
      headersTag,
      // firstHeader,
    };
  }
}
