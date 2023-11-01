import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Predictions } from 'src/entities/predictions.entity';
import { TrainningCycleService } from 'src/trainning-cycle/trainning-cycle.service';
import { Repository } from 'typeorm';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Predictions)
    public predictionsRepository: Repository<Predictions>,
    private trainningCycleService: TrainningCycleService,
  ) {}

  async create(createUserDto: any) {
    const cycle = await this.trainningCycleService.findLatestOne();
    const exist = await this.predictionsRepository.findOne({
      where: { text: createUserDto.text, trainningCycle: cycle },
    });
    if (!exist) {
      createUserDto['trainningCycle'] = cycle;
      const newUser = this.predictionsRepository.create({
        ...createUserDto,
      });
      return this.predictionsRepository.save(newUser);
    }
  }

  findAll() {
    return this.predictionsRepository.find();
  }

  findOne(id: number) {
    return this.predictionsRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: any) {
    return this.predictionsRepository.update({ id }, { ...updateUserDto });
  }

  remove(id: number) {
    return this.predictionsRepository.delete({ id });
  }
}
