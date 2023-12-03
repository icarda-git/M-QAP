import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Predictions } from './predictions.entity';

@Entity()
export class TrainingCycle {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  creation_date: string;

  @UpdateDateColumn()
  update_date: string;
  
  @Column()
  text: string;

  @OneToMany(() => Predictions, (predictions) => predictions.trainingCycle)
  predictions: Predictions[];
}
