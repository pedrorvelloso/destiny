import { injectable, inject } from 'inversify';
import ApplicationError from '@shared/errors/ApplicationError';

import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import IGamesRepository from '@modules/games/repositories/IGamesRepository';
import IIncentivesRepository from '../repositories/IIncentivesRepository';
import Incentive from '../infra/typeorm/entities/Incentive';

interface IRequest {
  game_id: number;
}

@injectable()
class ShowIncentiveByGameIdService {
  constructor(
    @inject('IncentivesRepository')
    private incentivesRepository: IIncentivesRepository,
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
  ) {}

  public async execute({ game_id }: IRequest): Promise<Incentive[]> {
    const activeEvent = await this.eventsRepository.fetchActiveEvent();

    if (!activeEvent) throw new ApplicationError('There is no active event');

    const game = await this.gamesRepository.findById(game_id);

    if (!game) throw new ApplicationError('Game not found', 404);

    const incentives = await this.incentivesRepository.findByGameId({
      event_id: activeEvent.id,
      game_id,
    });

    return incentives;
  }
}

export default ShowIncentiveByGameIdService;
