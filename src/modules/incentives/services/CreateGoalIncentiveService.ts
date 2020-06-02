import { injectable, inject } from 'inversify';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import IGamesRepository from '@modules/games/repositories/IGamesRepository';
import ApplicationError from '@shared/errors/ApplicationError';
import Incentive, { IIncentiveType } from '../infra/typeorm/entities/Incentive';
import IIncentivesRepository from '../repositories/IIncentivesRepository';
import IIncentiveOptionsRepository from '../repositories/IIncentiveOptionsRepository';

interface IRequest {
  name: string;
  description: string;
  user_id: string;
  event_id: number;
  game_id: number;
  goal: number;
}

@injectable()
class CreateGoalIncentiveService {
  constructor(
    @inject('IncentivesRepository')
    private incentivesRepository: IIncentivesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,
    @inject('IncentiveOptionsRepository')
    private incentiveOptionsRepository: IIncentiveOptionsRepository,
  ) {}

  public async execute({
    name,
    description,
    user_id,
    event_id,
    game_id,
    goal,
  }: IRequest): Promise<Incentive> {
    const checkEventExists = await this.eventsRepository.findById(event_id);
    const checkGameExists = await this.gamesRepository.findById(game_id);
    const checkUserExists = await this.usersRepository.findById(user_id);

    if (!checkEventExists || !checkGameExists || !checkUserExists)
      throw new ApplicationError('Error creating incentive');

    const checkIncentiveName = await this.incentivesRepository.findByName(name);

    if (checkIncentiveName) throw new ApplicationError('Incentive already set');

    const incentive = await this.incentivesRepository.create({
      name,
      description,
      created_by: user_id,
      event_id,
      game_id,
      enable_option: false,
      type: IIncentiveType.GOAL,
      goal,
    });

    const defaultOptions = await this.incentiveOptionsRepository.create({
      name,
      created_by: user_id,
      incentive_id: incentive.id,
    });

    incentive.options = [defaultOptions];

    return incentive;
  }
}

export default CreateGoalIncentiveService;
