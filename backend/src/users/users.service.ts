import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
  ) {}
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({where:{email}})
  }
}
