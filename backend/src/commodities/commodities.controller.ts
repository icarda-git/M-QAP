import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CommoditiesService } from './commodities.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateCommoditiesDto } from './dto/create-commodities.dto';

@Controller('commodities')
export class CommoditiesController {
  constructor(private commoditiesService: CommoditiesService) {}

  @Post()
  create(@Body() createUserDto: CreateCommoditiesDto) {
    return this.commoditiesService.create(createUserDto);
  }

  @Get('process-sheet/:fileName')
  processSheet(@Param('fileName') fileName: string) {
    return this.commoditiesService.processSheet(fileName);
  }

  @Get('')
  findAll(@Paginate() query: PaginateQuery) {
    return this.commoditiesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commoditiesService.findOne({ where: { id }, relations: ['parent'] });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.commoditiesService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commoditiesService.remove(+id);
  }
}
