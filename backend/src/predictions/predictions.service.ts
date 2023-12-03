import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Predictions } from 'src/entities/predictions.entity';
import { TrainingCycleService } from 'src/trainning-cycle/trainning-cycle.service';
import { Repository } from 'typeorm';

@Injectable()
export class PredictionsService {
  constructor(
    @InjectRepository(Predictions)
    public predictionsRepository: Repository<Predictions>,
    private trainingCycleService: TrainingCycleService,
  ) {}

  async create(createUserDto: any) {
    const cycle = await this.trainingCycleService.findLatestOne();
    const exist = await this.predictionsRepository.findOne({
      where: { text: createUserDto.text, trainingCycle: cycle },
    });
    if (!exist) {
      createUserDto['trainingCycle'] = cycle;
      const newUser = this.predictionsRepository.create({
        ...createUserDto,
      });
      return this.predictionsRepository.save(newUser);
    }
  }

  findAll(query: PaginateQuery): Promise<Paginated<Predictions>> {
    return paginate(query, this.predictionsRepository, {
      sortableColumns: ['id', 'text', 'claresa.(name)'],
      // defaultSortBy: [['text', 'DESC']],
      searchableColumns: ['text', 'claresa.(name)'],
      relations: ['trainingCycle', 'claresa'],
      select: [],
      filterableColumns: {},
    });
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
