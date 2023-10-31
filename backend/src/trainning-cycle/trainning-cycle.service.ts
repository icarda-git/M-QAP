import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainningCycle } from 'src/entities/trainning-cycle.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrainningCycleService {
  constructor(
    @InjectRepository(TrainningCycle)
    public trainningCycleRepository: Repository<TrainningCycle>,
  ) {}

  create(createUserDto: any) {
    const newUser = this.trainningCycleRepository.create({ ...createUserDto });
    return this.trainningCycleRepository.save(newUser);
  }

  findAll() {
    return this.trainningCycleRepository.find();
  }

  findOne(id: number) {
    return this.trainningCycleRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: any) {
    return this.trainningCycleRepository.update({ id }, { ...updateUserDto });
  }

  remove(id: number) {
    return this.trainningCycleRepository.delete({ id });
  }
}
