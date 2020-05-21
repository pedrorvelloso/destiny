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

  @Column({ nullable: true })
  event_id?: number | null;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Donation;
