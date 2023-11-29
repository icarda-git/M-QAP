import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Commodities } from 'src/entities/commodities.entity';
import { IsNull, Not, Repository } from 'typeorm';


@Injectable()
export class CommoditiesService {
    constructor(
        @InjectRepository(Commodities)
        public commoditiesRepository: Repository<Commodities>,
      ) {}



      create(createUserDto: any) {
        const newUser = this.commoditiesRepository.create({ ...createUserDto });
        return this.commoditiesRepository.save(newUser);
      }
    
      findAll() {
        return this.commoditiesRepository.find();
      }
    
      findOne(id: number) {
        return this.commoditiesRepository.findOne({ where: { id } });
      }
    
      findLatestOne() {
        return this.commoditiesRepository.findOne({ where:{ id:Not(IsNull())  }, order:{id:'DESC'} });
      }
    
      update(id: number, updateUserDto: any) {
        return this.commoditiesRepository.update({ id }, { ...updateUserDto });
      }
    
      remove(id: number) {
        return this.commoditiesRepository.delete({ id });
      }
}
