import { injectable, inject } from 'inversify';

import ApplicationError from '@shared/errors/ApplicationError';
import IGamesRepository from '../repositories/IGamesRepository';
import Game from '../infra/typeorm/entities/Game';

interface IRequest {
  name: string;
}

@injectable()
class CreateGameService {
  constructor(
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({ name }: IRequest): Promise<Game> {
    const checkGameExists = await this.gamesRepository.findByName(name);

    if (checkGameExists) throw new ApplicationError('Game already exists');

    const game = await this.gamesRepository.create({ name });

    return game;
  }
}

export default CreateGameService;
