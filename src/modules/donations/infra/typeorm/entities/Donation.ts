import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('donations')
class Donation {
  @PrimaryGeneratedColumn('increment')
  id: number;

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
