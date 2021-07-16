import { injectable } from 'inversify';
import { getRepository, Repository, Like } from 'typeorm';

import Game from '@modules/games/infra/typeorm/entities/Game';

import ICreateGameDTO from '@modules/games/dtos/ICreateGameDTO';
import IGamesRepository from '@modules/games/repositories/IGamesRepository';
import ISearchDTO from '@shared/dtos/ISearchDTO';

@injectable()
class GamesRepository implements IGamesRepository {
  private ormRepository: Repository<Game>;

  constructor() {
    this.ormRepository = getRepository(Game);
  }

  public async findById(id: number): Promise<Game | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByName(name: string): Promise<Game | undefined> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async search({ input, limit = 5 }: ISearchDTO): Promise<Game[]> {
    const where = input ? { name: Like(`%${input}%`) } : {};
    return this.ormRepository.find({
      where,
      take: limit,
    });
  }

  public async create({ name }: ICreateGameDTO): Promise<Game> {
    const game = this.ormRepository.create({ name });

    return this.ormRepository.save(game);
  }
}

export default GamesRepository;
