import { Controller, Get, Param, Post, UploadedFiles, UseInterceptors, Delete, Res } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { MediaService } from './media.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';
@ApiExcludeController()
@Controller('media')
export class MediaController {
  logger = new Logger('media');
  mediaPath = process.cwd();

  constructor(private mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: join(process.cwd(), 'media'),
        filename: (req, file, cb) => {
          const fileNameSplit = file.originalname.split('.');
          const fileExt = fileNameSplit[fileNameSplit.length - 1];
          const name = file.originalname
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

          cb(null, `${name}-${uuidv4()}.${fileExt}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFiles() files) {
    return { fileName: files[0].filename };
  }

  @Get(':id')
  async getFileObject(@Param('id') id, @Res() res) {
    return this.mediaService.getFileObject(id, res);
  }

  @Get('file/:id')
  async getFileBinary(@Param('id') id, @Res() res) {
    return this.mediaService.getFileBinary(id, res);
  }

  @Delete(':id')
  async deleteImage(@Param('id') id) {
    // if (!isNumber(+id)) throw new BadRequestException();
    //TODO implement this method
    // return this.mediaService.removeFile(id);
  }
}

// export const environment = {
//   production: true,
//   MEL_URL: 'https://dev.mel.cgiar.org',
//   frontendUrl: '',
//   gojs_licenseKey: '73f944e7b56731b700ca0d2b113f69ee1bb37a679e821ef45a0541a0ef0a681270c9ed7958818fc7d4fb4ffb197bc2da8dcc6d7e855c033db737d3da13b2d2fab03471e11d0e42dcad5422939fa82aa6fb797',
//   mel_client_id: 17,
//   apiUrl: '/api'
// };
