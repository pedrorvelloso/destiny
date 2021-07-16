import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Event from '@modules/events/infra/typeorm/entities/Event';
import User from '@modules/users/infra/typeorm/entities/User';
import IncentiveOption from '@modules/incentives/infra/typeorm/entities/IncentiveOption';

@Entity('donations')
class Donation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  from: string;

  @Column()
  message: string;

  @Column('float', { precision: 5, scale: 2 })
  amount: number;

  @Column()
  source: string;

  @Column({ default: false })
  reviewed: boolean;

  @Column({ nullable: true })
  event_id?: number | null;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column()
  reviewed_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column({ nullable: true })
  donation_incentive?: number;

  @ManyToOne(() => IncentiveOption)
  @JoinColumn({ name: 'donation_incentive' })
  incentive?: IncentiveOption;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Donation;
