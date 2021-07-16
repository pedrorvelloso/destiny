import { injectable, inject } from 'inversify';
import IGamesRepository from '../repositories/IGamesRepository';
import Game from '../infra/typeorm/entities/Game';

interface IRequest {
  search?: string;
  limit?: number;
}

@injectable()
class SearchGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute(data?: IRequest): Promise<Game[]> {
    const find = await this.gamesRepository.search({
      input: data?.search,
      limit: data?.limit,
    });

    return find;
  }
}

export default SearchGameService;
