import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainningData } from 'src/entities/trainning-data.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrainningDataService {
  constructor(
    @InjectRepository(TrainningData)
    public trainningDataRepository: Repository<TrainningData>,
  ) {}

  create(createUserDto: any) {
    const newUser = this.trainningDataRepository.create({ ...createUserDto });
    return this.trainningDataRepository.save(newUser);
  }

  findAll() {
    return this.trainningDataRepository.find();
  }

  findOne(id: number) {
    return this.trainningDataRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: any) {
    return this.trainningDataRepository.update({ id }, { ...updateUserDto });
  }

  remove(id: number) {
    return this.trainningDataRepository.delete({ id });
  }
}
