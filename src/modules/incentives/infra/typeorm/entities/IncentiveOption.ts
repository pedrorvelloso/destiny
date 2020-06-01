import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import Incentive from './Incentive';

@Entity('incentive_options')
class IncentiveOption {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Exclude()
  @Column()
  incentive_id: number;

  @ManyToOne(() => Incentive)
  @JoinColumn({ name: 'incentive_id' })
  incentive: Incentive;

  @Column()
  created_by?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  user?: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default IncentiveOption;
