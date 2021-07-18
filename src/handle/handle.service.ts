import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleService {
  isHandle(doi): any {
    const result = new RegExp(`(?<=)10\..*`).exec(doi);
    return result ? result[0].toLowerCase() : false;
  }
}
