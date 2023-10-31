import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
  } from '@nestjs/common';
  import { TrainningCycleService } from './trainning-cycle.service';
  
  @Controller('trainning-cycle')
  export class TrainningCycleController {
    constructor(private trainningCycleService: TrainningCycleService) {}
    @Post()
    create(@Body() createUserDto: any) {
      return this.trainningCycleService.create(createUserDto);
    }
  
    @Get('')
    findAll() {
      return this.trainningCycleService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.trainningCycleService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: any) {
      return this.trainningCycleService.update(+id, updateUserDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.trainningCycleService.remove(+id);
    }
  }
  