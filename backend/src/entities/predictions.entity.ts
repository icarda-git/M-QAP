import { type } from 'os';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TrainningCycle } from './trainning-cycle.entity';
import { Organization } from './organization.entity';

@Entity()
export class Predictions {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;

  @Column()
  clarisa_id: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'clarisa_id' ,})
  claresa: Organization;

  @Column({ type: 'float' })
  confidant: number;
  @ManyToOne(() => TrainningCycle, (trainningCycle) => trainningCycle.predictions)
  trainningCycle: TrainningCycle;
}
