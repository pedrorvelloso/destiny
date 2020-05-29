import Game from '../infra/typeorm/entities/Game';
import ICreateGameDTO from '../dtos/ICreateGameDTO';
import ISearchGameDTO from '../dtos/ISearchGameDTO';

export default interface IGamesRepository {
  findById(id: number): Promise<Game | undefined>;
  findByName(name: string): Promise<Game | undefined>;
  search(data: ISearchGameDTO): Promise<Game[]>;
  create(data: ICreateGameDTO): Promise<Game>;
}
