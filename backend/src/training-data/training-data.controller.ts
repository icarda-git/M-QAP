import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TrainingDataService } from './training-data.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('training-data')
export class TrainingDataController {
  constructor(private trainingDataService: TrainingDataService) {}

  @Post()
  create(@Body() createUserDto: any) {
    return this.trainingDataService.create(createUserDto);
  }

  @Get('process-sheet/:fileName')
  processSheet(@Param('fileName') fileName: string) {
    return this.trainingDataService.processSheet(fileName);
  }

  @Get('')
  findAll(@Paginate() query: PaginateQuery) {
    return this.trainingDataService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.trainingDataService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.trainingDataService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingDataService.remove(+id);
  }
}
