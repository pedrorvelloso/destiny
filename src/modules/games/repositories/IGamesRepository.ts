import ISearchDTO from '@shared/dtos/ISearchDTO';
import Game from '../infra/typeorm/entities/Game';
import ICreateGameDTO from '../dtos/ICreateGameDTO';

export default interface IGamesRepository {
  findById(id: number): Promise<Game | undefined>;
  findByName(name: string): Promise<Game | undefined>;
  search(data: ISearchDTO): Promise<Game[]>;
  create(data: ICreateGameDTO): Promise<Game>;
}
