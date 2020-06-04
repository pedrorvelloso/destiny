import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  AfterLoad,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import Donation from '@modules/donations/infra/typeorm/entities/Donation';
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

  @OneToMany(_type => Donation, donation => donation.incentive, { eager: true })
  @Exclude()
  donations: Donation[];

  total: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @AfterLoad()
  async getTotal(): Promise<void> {
    let total = 0;
    const donations = await this.donations;
    donations.forEach(donation => {
      total += donation.amount;
    });

    this.total = total;
  }
}

export default IncentiveOption;
