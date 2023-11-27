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

@Controller('predictions')
export class PredictionsController {
  constructor(private predictionsService: PredictionsService) {}
  @Post()
  create(@Body() createUserDto: any) {
    return this.predictionsService.create(createUserDto);
  }

  @Get('')
  findAll() {
    return this.predictionsService.findAll();
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
