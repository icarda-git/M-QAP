import { Injectable } from '@nestjs/common';
import { DoiInfo } from 'src/doi-info';

@Injectable()
export class HandleService {

    isHandle(doi): any {
        let result = new RegExp(`(?<=)10\..*`).exec(doi)
        return result ? result[0].toLowerCase() : false;
    }
    async getWOSinfoByHandle(doi): Promise<DoiInfo> {

        return {} as DoiInfo
    }
}
