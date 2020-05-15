import {
  Entity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Donation {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  from: string;

  @Column()
  message: string;

  @Column()
  amount: number;

  @Column()
  source: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Donation;
