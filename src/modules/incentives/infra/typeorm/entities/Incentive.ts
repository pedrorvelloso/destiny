import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import Game from '@modules/games/infra/typeorm/entities/Game';
import Event from '@modules/events/infra/typeorm/entities/Event';
import IncentiveOption from './IncentiveOption';

export enum IIncentiveType {
  META = 'meta',
  OPTION = 'option',
}

@Entity('incentives')
class Incentive {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  created_by?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  user?: User;

  @Column()
  game_id: number;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column()
  event_id: number;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ type: 'enum', enum: IIncentiveType })
  type: IIncentiveType;

  @Column()
  enable_option: boolean;

  @Column({ nullable: true })
  meta?: number;

  @Column('timestamp with time zone', { nullable: true })
  ended_at: Date;

  @OneToMany(_type => IncentiveOption, option => option.incentive)
  options: IncentiveOption[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Incentive;
