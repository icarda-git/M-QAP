import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
const excelToJson = require('convert-excel-to-json');
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
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
    return paginate(query, this.commoditiesRepository, {
      sortableColumns: ['id', 'name'],
      searchableColumns: ['name'],
      relations: ['parent'],
      select: [],
      filterableColumns: {
        parent_id: [FilterOperator.NULL],
      },
    });
  }

  public findOneByName(name: string): Promise<Commodity> {
    return paginate(
      {
        page: 1,
        limit: 1,
        search: name,
        filter: { parent_id: '$null' },
        path: 'http://localhost:3000/commodities',
      },
      this.commoditiesRepository,
      {
        sortableColumns: ['id', 'name'],
        searchableColumns: ['name'],
        relations: ['parent'],
        select: [],
        filterableColumns: {
          parent_id: [FilterOperator.NULL],
        },
      },
    ).then((result) => result.data[0] ?? null);
  }

  async processSheet(fileName: string) {
    const filePath = resolve(process.cwd(), 'media', fileName);

    const recordsList: Array<{ A: string; B: string }> =
      excelToJson({ sourceFile: filePath })?.Sheet1 ?? [];
    recordsList.pop();
    for await (const item of recordsList) {
      const commodity = await this.create({
        name: item.A,
        source: 'system/excel',
      }).catch(() => {
        console.info('Duplicated Parent : ', item.A);

        return this.findOneByName(item.A);
      });

      const names =
        ((item.B ?? '').split(',') ?? []).map((i) => i.trim()) ?? [];
      for await (const name of names) {
        await this.create({
          name: name,
          parent: commodity,
          source: 'system/excel',
        }).catch(() => {
          console.info('Duplicated Child : ', item.A);

          return null;
        });
      }
    }
    return recordsList;
  }

  update(id: number, updateUserDto: any) {
    return this.commoditiesRepository.update({ id }, { ...updateUserDto });
  }

  remove(id: number) {
    return this.commoditiesRepository.delete({ id });
  }
}
