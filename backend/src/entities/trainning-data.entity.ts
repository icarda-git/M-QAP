import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class TrainningData {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    text: string;
  
    @Column()
    clarisa_id: string;
  
    @Column()
    source: string;
  
  }
  