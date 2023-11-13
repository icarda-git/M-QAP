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
import { TrainningCycleService } from './trainning-cycle.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
@Controller('trainning-cycle')
export class TrainningCycleController {
  constructor(private trainningCycleService: TrainningCycleService) {}
  @Post()
  create(@Body() createUserDto: any) {
    return this.trainningCycleService.create(createUserDto);
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
