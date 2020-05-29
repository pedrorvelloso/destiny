import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('games')
class Game {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;
}

export default Game;
