import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { Brackets, In } from 'typeorm';
import { createAndUpdateUsers, exportToExcel, getUsers } from 'src/users/dto/users.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminRolesGuard)
@ApiCreatedResponse({
  description: '',
  type: [User],
})
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  sort(query) {
    if (query?.sort) {
      let obj = {};
      const sorts = query.sort.split(',');
      obj[sorts[0]] = sorts[1];
      return obj;
    } else return { id: 'ASC' };
  }
  @Get()
  @ApiCreatedResponse({
    description: '',
    type: getUsers,
  })
  async getUsers(@Query() query) {
    if (query.search == 'teamMember') {
      return this.usersService.userRepository
        .createQueryBuilder('users')
        .where('users.full_name like :full_name', {
          full_name: `%${query.full_name}%`,
        })
        .orWhere('users.email like :email', { email: `%${query.email}%` })
        .select([
          'users.id as id',
          'users.full_name as full_name',
          'users.email as email',
        ])
        .getRawMany();
    } else {
      const take = query.limit || 10;
      const skip = (Number(query.page || 1) - 1) * take;
      let ids = await this.usersService.userRepository
        .createQueryBuilder('users')
        .where('users.role = :role', {role: query?.role ? query?.role : 0})
        .andWhere(
          new Brackets((qb) => {
            qb.where('users.full_name like :full_name', {
              full_name: `%${query.email || ''}%`,
            }).orWhere('users.email like :email', { email: `%${query.email || ''}%` });
          }),
        )
        .orderBy(this.sort(query))
        .skip(skip || 0)
        .take(take || 10)

        const finalResult = await ids.getManyAndCount();
        return {
          result: finalResult[0],
          count: finalResult[1],
        };
    }
  }
  @Roles()
  @Put()
  @ApiBody({ type: createAndUpdateUsers })
  @ApiCreatedResponse({
    description: '',
    type: createAndUpdateUsers,
  })
  async updateUser(@Body() data: any) {
    const emailExist = await this.usersService.userRepository.findOne({
      where: { email: data.email },
    });
    if (emailExist == null || emailExist.id == data.id) {
      const user = this.usersService.userRepository.create();
      if (data?.email) data['email'] = data?.email.toLowerCase();
      Object.assign(user, data);
      return this.usersService.userRepository.save(user, { reload: true });
    } else {
      throw new BadRequestException('The email is already used');
    }
  }
  @Roles()
  @Post()
  @ApiBody({ type: createAndUpdateUsers })
  @ApiCreatedResponse({
    description: '',
    type: createAndUpdateUsers,
  })
  async addUser(@Body() data: any) {
    const emailExist = await this.usersService.userRepository.findOne({
      where: { email: data.email },
    });
    if (emailExist == null) {
      const user = this.usersService.userRepository.create();
      if (data?.email) data['email'] = data?.email.toLowerCase();
      Object.assign(user, data);
      await this.usersService.userRepository.save(user, { reload: true });
      return user;
    } else {
      throw new BadRequestException('User already exist');
    }
  }
  @Roles()
  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.userRepository.delete(id);
  }
  @Roles()
  @Get('export/all')
  @ApiCreatedResponse({
    description: '',
    type: exportToExcel,
  })
  async export(@Query() query:any) {
    let users = await this.usersService.userRepository
    .createQueryBuilder('users')
    .where('users.full_name like :full_name', {
      full_name: `%${query.email}%`,
    })
    .orWhere('users.email like :email', { email: `%${query.email}%` })
    .select('users.id as id')
    .getRawMany();
    
    const result =
    await this.usersService.userRepository.find({
      where: {
        id: users.length ? In(users.map(d=>d.id)) : null,
        role: query?.role ? query?.role : null,
      },
      order: { ...this.sort(query) },
    });

    const file_name = 'All-Users.xlsx';
    var wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(result);

    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    await XLSX.writeFile(wb, join(process.cwd(), 'generated_files', file_name));
    const file = createReadStream(
      join(process.cwd(), 'generated_files', file_name),
    );

    setTimeout(async () => {
      try {
        await unlink(join(process.cwd(), 'generated_files', file_name));
      } catch (e) {}
    }, 9000);
    return new StreamableFile(file, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file_name}"`,
    });
  }
}
