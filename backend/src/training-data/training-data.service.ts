import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingData } from 'src/entities/training-data.entity';
import { Repository } from 'typeorm';
const excelToJson = require('convert-excel-to-json');
import { resolve } from 'path';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';

@Injectable()
export class TrainingDataService extends TypeOrmCrudService<TrainingData> {
  constructor(
    @InjectRepository(TrainingData)
    public trainingDataRepository: Repository<TrainingData>,
  ) {
    super(trainingDataRepository);
  }

  create(createUserDto: any) {
    this.find({});
    const newUser = this.trainingDataRepository.create({ ...createUserDto });
    return this.trainingDataRepository.save(newUser);
  }

  // findAll() {
  //   return this.trainingDataRepository.find({ relations: ['claresa'] });
  // }

  public findAll(query: PaginateQuery): Promise<Paginated<TrainingData>> {
    console.log(query);
    return paginate(query, this.trainingDataRepository, {
      sortableColumns: ['id', 'text', 'claresa.(name)'],
      // defaultSortBy: [['text', 'DESC']],
      searchableColumns: ['text', 'claresa.(name)'],
      relations: ['claresa'],
      select: [],
      filterableColumns: {},
    });
  }

  async processSheet(fileName: string) {
    const filePath = resolve(process.cwd(), 'media', fileName);

    const result: Array<{ A: string; B: number }> =
      excelToJson({
        sourceFile: filePath,
      })?.Foglio1 ?? [];
    result.pop(); //remove columns readers.

    for await (const item of result) {
      console.log(item);
      const record = this.trainingDataRepository.create({
        clarisa_id: item.B,
        text: item.A,
        source: 'system/excel',
      });
      await this.trainingDataRepository.save(record).catch((e) => {
        console.log('>>>>>>>>>>>>>>>>>>>>>> error');
      });
    }

    return result;
  }

  //  findOne(id: number) {
  //   return this.trainingDataRepository.findOne({ where: { id } });
  // }

  update(id: number, updateUserDto: any) {
    return this.trainingDataRepository.update({ id }, { ...updateUserDto });
  }

  remove(id: number) {
    return this.trainingDataRepository.delete({ id });
  }
}
