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
  

 

@Controller('commodities')
export class CommoditiesController {
    constructor(private  commoditiesService: CommoditiesService) {}
    @Post()
    create(@Body() createUserDto: any) {
      return this.commoditiesService.create(createUserDto);
    }
  
    @Get('')
    findAll() {
      return this.commoditiesService.findAll();
    }
  
  
    
  
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.commoditiesService.findOne(+id);
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
