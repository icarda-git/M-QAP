import { Controller, Post, UseInterceptors, UploadedFile, HttpStatus, HttpException, Body, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiUseTags, ApiImplicitFile, ApiImplicitBody, ApiModelProperty, ApiConsumes } from '@nestjs/swagger';
import { WosService } from './wos.service';

const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
        return callback(new HttpException('Only Excel files are allowed!', HttpStatus.NOT_ACCEPTABLE), false);
    }
    callback(null, true);
};
const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};


class UserData {
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    email: string;
}
@ApiUseTags('Web of Science')
@Controller('wos')
export class WosController {
    constructor(private wos: WosService) { }
    @ApiImplicitFile({
        name: "file",
        description: "upload file",
        required: true
    })
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: process.env.UPLOADS_DIR + '/wos/',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    @ApiConsumes('multipart/form-data')
    async uploadedFile(@UploadedFile() file, @Body() userinfo: UserData) {
        if (userinfo.email && userinfo.name)
            return this.wos.audit(file.filename, userinfo);
        else
            throw new HttpException('BadRequst user info must be provided', HttpStatus.BAD_REQUEST);
    }

    @Get('/train')
    async testTrain() {
         this.wos.training();

         return "ok";
    }
}
