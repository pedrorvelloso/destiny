import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('events')
class Event {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  active: boolean;

  @Column('time with time zone')
  starts_at: Date;

  @Column('time with time zone')
  ends_at: Date;

  @Column('time with time zone', { nullable: true })
  ended_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Event;
