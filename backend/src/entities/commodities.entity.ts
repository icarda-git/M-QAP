import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class Commodity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  source: string;

  @Column({ nullable: true })
  parent_id?: number;

  @ManyToOne(() => Commodity)
  @JoinColumn({ name: 'parent_id' })
  parent: Commodity;
}
