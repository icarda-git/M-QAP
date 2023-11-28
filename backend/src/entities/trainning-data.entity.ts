import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Organization } from './organization.entity';
  
  @Entity()
  export class TrainningData {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    text: string;
  
    @Column()
  clarisa_id: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'clarisa_id' ,})
  claresa: Organization;
  
    @Column()
    source: string;
  
  }
  