import { Body, Controller, Post, Get, Request, Response } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { Request as Req, Response as Res } from 'express';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private redis: RedisService,
  ) {}

  @Post('/short_url')
  async createShortUrl(@Body() body: { url: string }) {
    const shortUrl = await this.appService.createShortUrl(body.url);
    await this.redis.set(shortUrl, body.url, 3600);
    return shortUrl;
  }

  @Get('/short/:hash')
  async getLongUrl(@Request() req: Req, @Response() redirect: Res) {
    const wholeUrl = `${process.env.DOMAIN_NAME}${req.url}`;
    const fromCache = await this.redis.get(wholeUrl);
    if (fromCache) {
      console.log('from cache');
      await this.appService.updateShortUrlHits(wholeUrl);
      return redirect.redirect(302, fromCache);
    }
    const longUrl = await this.appService.getLongUrl(wholeUrl);
    if (!longUrl) {
      return redirect.status(404).send('Not Found');
    }
    await this.appService.updateShortUrlHits(wholeUrl);
    return redirect.redirect(302, longUrl);
  }
}
