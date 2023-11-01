import { type } from 'os';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainningCycle } from './trainning-cycle.entity';

@Entity()
export class Predictions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;
  @Column()
  clarisa_id: number;
  @Column({ type: 'float' })
  confidant: number;
  @ManyToOne(() => TrainningCycle, (trainningCycle) => trainningCycle.predictions)
  trainningCycle: TrainningCycle;
}
