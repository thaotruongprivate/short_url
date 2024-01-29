import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AppService {
  private hashingService: HashingService;
  private prisma: PrismaService;

  constructor(hashingService: HashingService, prisma: PrismaService) {
    this.hashingService = hashingService;
    this.prisma = prisma;
  }
  async createShortUrl(longUrl: string): Promise<string> {
    const hit = await this.prisma.longUrl.findUnique({
      where: { longUrl: longUrl },
    });
    if (hit) {
      return hit.shortUrl;
    }

    let shortUrl: string;
    const url = longUrl;
    while (true) {
      const hash = this.hashingService.hash(longUrl);
      shortUrl = `${process.env.DOMAIN_NAME}/short/${hash.substring(0, 5)}`;
      const found = await this.prisma.longUrl.findUnique({
        where: { shortUrl },
      });
      if (!found) {
        break;
      }
      longUrl += Math.random().toString(36).substring(2, 15);
    }
    await this.prisma.longUrl.create({
      data: {
        longUrl: url,
        shortUrl,
      },
    });
    return shortUrl;
  }

  async getLongUrl(shortUrl: string) {
    const hit = await this.prisma.longUrl.findUnique({
      where: { shortUrl },
    });
    return hit?.longUrl;
  }

  async updateShortUrlHits(shortUrl: string) {
    await this.prisma.longUrl.update({
      where: { shortUrl },
      data: { clicks: { increment: 1 } },
    });
  }
}
