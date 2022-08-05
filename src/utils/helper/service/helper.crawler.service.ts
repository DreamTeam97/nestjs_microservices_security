import { Injectable } from '@nestjs/common';
import _ from 'lodash';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class HelperCrawlerService {
  async fetchHtmlFromUrl(url: string) {
    const httpsUrl: string = this.enforceHttpsUrl(url);
    console.log('httpsUrl', httpsUrl);

    return await axios
      .get(url)
      .then((response) => cheerio.load(response.data))
      .catch((error) => {
        error.status = (error.response && error.response.status) || 500;
        throw error;
      });
  }

  enforceHttpsUrl(url: string): any {
    _.isString(url) ? url.replace(/^(https?:)?\/\//, 'https://') : null;
  }
}
