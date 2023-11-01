import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Predictions } from './predictions.entity';
  
  @Entity()
  export class TrainningCycle {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    text: string;

    @OneToMany(() => Predictions, (predictions) => predictions.trainningCycle)
    predictions: Predictions[];
  
  

  }
  