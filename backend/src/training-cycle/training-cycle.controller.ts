import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TrainingCycleService } from './training-cycle.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
@Controller('training-cycle')
export class TrainingCycleController {
  constructor(private trainingCycleService: TrainingCycleService) {}
  @Post()
  create(@Body() createUserDto: any) {
    return this.trainingCycleService.create(createUserDto);
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id,
    @Body('type') type,
  ) {
    const training_folder_path = path.join(
      process.cwd(),
      'uploads/training-data/' + id,
    );
    fs.mkdirSync(training_folder_path, {
      recursive: true,
    });
    fs.writeFileSync(
      path.join(training_folder_path, '/' + file.originalname),
      file.buffer,
    );

    return file;
  }

  @Get('')
  findAll(@Paginate() query: PaginateQuery) {
    return this.trainingCycleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainingCycleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.trainingCycleService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trainingCycleService.remove(+id);
  }
}
