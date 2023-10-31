import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TrainningDataService } from './trainning-data.service';

@Controller('trainning-data')
export class TrainningDataController {
  constructor(private trainningDataService: TrainningDataService) {}
  @Post()
  create(@Body() createUserDto: any) {
    return this.trainningDataService.create(createUserDto);
  }

  @Get('')
  findAll() {
    return this.trainningDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainningDataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.trainningDataService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainningDataService.remove(+id);
  }
}
