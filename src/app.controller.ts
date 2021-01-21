import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { query } from 'express';
import { AppService } from './app.service';
import { AuthGuard } from './auth.guard';
import { DoiService } from './doi/doi.service';

@Controller()
export class AppController {
  constructor(private readonly doiService: DoiService) { }
  @UseGuards(AuthGuard)
  @Get('/')
  info(@Query('link') link: string): any {
    let doi = this.doiService.isDOI(link)
    if (doi)
      return this.doiService.getInfoByDOI(doi);
    else
      throw new HttpException('BadRequst DOI info must be provided', HttpStatus.BAD_REQUEST);
  }
}
