import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HashingService } from './hashing/hashing.service';
import { HashingModule } from './hashing/hashing.module';
import { PrismaModule } from 'nestjs-prisma';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [HashingModule, PrismaModule.forRoot(), RedisModule],
  controllers: [AppController],
  providers: [AppService, HashingService],
})
export class AppModule {}
