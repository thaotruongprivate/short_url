import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashingService {
  public hash(string: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(string);
    return hash.digest('hex');
  }
}
