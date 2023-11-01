import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
class UserLogin {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
class AuthCode {
  @ApiProperty()
  code: string;
}
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor() {}

  @ApiBasicAuth()
  @UseGuards(AuthGuard('AWS'))
  @Post('aws')
  awsAuth(@Request() req, @Body() authCode: AuthCode) {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type:User,
    description:'hit with Barer token to get logedin user profile'
  })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
