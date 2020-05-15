import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Donation {
  @ObjectIdColumn()
  _id: string;

  @Column()
  from: string;

  @Column()
  message: string;

  @Column()
  amount: number;

  @Column()
  source: string;

  @Column({ default: false })
  reviewed: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Donation;
