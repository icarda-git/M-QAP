import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { TrainingCycle as TrainingCycle } from 'src/entities/training-cycle.entity';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class TrainingCycleService {
  constructor(
    @InjectRepository(TrainingCycle)
    public trainingCycleRepository: Repository<TrainingCycle>,
  ) {}

  create(createUserDto: any) {
    const newUser = this.trainingCycleRepository.create({ ...createUserDto });
    return this.trainingCycleRepository.save(newUser);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<TrainingCycle>> {
    console.log(query);
    return paginate(query, this.trainingCycleRepository, {
      sortableColumns: ['id', 'text', 'creation_date'],
      searchableColumns: ['text', 'creation_date'],
      relations: [],
      select: [],
      filterableColumns: {},
    });
  }
  findOne(id: number) {
    return this.trainingCycleRepository.findOne({ where: { id } });
  }

  findLatestOne() {
    return this.trainingCycleRepository.findOne({
      where: { id: Not(IsNull()) },
      order: { id: 'DESC' },
    });
  }

  update(id: number, updateUserDto: any) {
    return this.trainingCycleRepository.update({ id }, { ...updateUserDto });
  }

  remove(id: number) {
    return this.trainingCycleRepository.delete({ id });
  }
}
