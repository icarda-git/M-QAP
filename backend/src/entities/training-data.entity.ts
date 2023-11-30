import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity({})
export class TrainingData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  text: string;

  @Column()
  clarisa_id: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'clarisa_id' })
  claresa: Organization;

  @Column()
  source: string;
}
