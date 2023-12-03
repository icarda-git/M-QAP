import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
const excelToJson = require('convert-excel-to-json');
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { resolve } from 'path';
import { Commodity } from 'src/entities/commodities.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommoditiesService extends TypeOrmCrudService<Commodity> {
  constructor(
    @InjectRepository(Commodity)
    public commoditiesRepository: Repository<Commodity>,
  ) {
    super(commoditiesRepository);
  }

  create(createUserDto: Partial<Commodity>) {
    const newUser = this.commoditiesRepository.create({ ...createUserDto });
    return this.commoditiesRepository.save(newUser);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<Commodity>> {
    console.log(query);
    return paginate(query, this.commoditiesRepository, {
      sortableColumns: ['id', 'name'],
      searchableColumns: ['name'],
      relations: ['parent'],
      select: [],
      filterableColumns: {},
    });
  }

  async processSheet(fileName: string) {
    const filePath = resolve(process.cwd(), 'media', fileName);

    const result: Array<{ A: string; B: string }> =
      excelToJson({ sourceFile: filePath })?.Sheet1 ?? [];
    result.pop();
    console.log(result);
    for await (const item of result) {
      console.log(item);
      const commodity = await this.create({
        name: item.A,
        source: 'system/excel',
      });

      const names =
        ((item.B ?? '').split(',') ?? []).map((i) => i.trim()) ?? [];
      for await (const name of names) {
        console.log({
          name: name,
          parent: commodity,
          source: 'system/excel',
        });
        await this.create({
          name: name,
          parent: commodity,
          source: 'system/excel',
        });
      }
    }
    return result;
  }

  update(id: number, updateUserDto: any) {
    return this.commoditiesRepository.update({ id }, { ...updateUserDto });
  }

  remove(id: number) {
    return this.commoditiesRepository.delete({ id });
  }
}
