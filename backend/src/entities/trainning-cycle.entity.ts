import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity()
  export class TrainningCycle {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    text: string;
  

  }
  