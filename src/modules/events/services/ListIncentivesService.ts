import ApplicationError from '@shared/errors/ApplicationError';
import { injectable, inject } from 'inversify';
import IIncentivesRepository from '@modules/incentives/repositories/IIncentivesRepository';
import Incentive from '@modules/incentives/infra/typeorm/entities/Incentive';
import IEventsRepository from '../repositories/IEventsRepository';

interface IRequest {
  event_id: number;
}

@injectable()
class ListIncentivesService {
  constructor(
    @inject('IncentivesRepository')
    private incentivesRepository: IIncentivesRepository,
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {}

  public async execute({ event_id }: IRequest): Promise<Incentive[]> {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event does not exists');

    const incentives = await this.incentivesRepository.findByEventId(event_id);

    const sorted = incentives.map(incentive => {
      incentive.options.sort((a, b) => b.total - a.total);
      return incentive;
    });

    return sorted;
  }
}

export default ListIncentivesService;
