import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { timestamp } from '@shared/infra/typeorm/utils/timeColumn';

@Entity('events')
class Event {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  active: boolean;

  @Column(timestamp)
  starts_at: Date;

  @Column(timestamp)
  ends_at: Date;

  @Column(timestamp, { nullable: true })
  ended_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Event;
