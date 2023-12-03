import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { TrainingData } from 'src/entities/training-data.entity';
import { Paginate, PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Controller('predictions')
export class PredictionsController {
  constructor(private predictionsService: PredictionsService) {}
  @Post()
  create(@Body() createUserDto: any) {
    return this.predictionsService.create(createUserDto);
  }

  @Get('')
  findAll(@Paginate() query: PaginateQuery) {
    return this.predictionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.predictionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.predictionsService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.predictionsService.remove(+id);
  }
}
