import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { AI } from './ai/ai.service';
import { DoiService } from './doi/doi.service';
import { HandleService } from './handle/handle.service';

@Controller()
export class AppController {
  constructor(
    private readonly doiService: DoiService,
    private handleService: HandleService,
    private ai: AI,
  ) {}
  //@UseGuards(AuthGuard)
  @Get('/')
  async info(
    @Query('link') link: string = null,
    @Query('handle') handle: string,
  ) {
    if (link) {
      const doi = this.doiService.isDOI(link);
      if (doi) return this.doiService.getInfoByDOI(doi);
      else
        throw new HttpException(
          'Bad request valid DOI must be provided',
          HttpStatus.BAD_REQUEST,
        );
    } else if (handle) {
      return this.handleService.getInfoByHandle(handle);
    } else
      throw new HttpException(
        'Bad request valid handle must be provided',
        HttpStatus.BAD_REQUEST,
      );
  }
  @Get('/qa')
  async qaInfo(@Query('link') link: string = null) {
    if (link) {
      return this.handleService.getInfoByHandle(link);
    } else
      throw new HttpException(
        'Bad request valid handle must be provided',
        HttpStatus.BAD_REQUEST,
      );
  }

  @Get('/predict/:name')
  async predict(@Param('name') name: string = null) {
    return await this.ai.makePrediction(name, 'NA');
  }
}
