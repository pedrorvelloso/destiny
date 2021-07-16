import ApplicationError from '@shared/errors/ApplicationError';
import { injectable, inject } from 'inversify';
import IIncentivesRepository from '@modules/incentives/repositories/IIncentivesRepository';
import Incentive from '@modules/incentives/infra/typeorm/entities/Incentive';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { INCENTIVES_LIST } from '@shared/container/providers/CacheProvider/utils/prefixes';
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
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ event_id }: IRequest): Promise<Incentive[]> {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event does not exists');

    let incentives = await this.cacheProvider.get<Incentive[]>(
      `${INCENTIVES_LIST}:${event_id}`,
    );

    if (!incentives) {
      const fetchIncentives = await this.incentivesRepository.findByEventId(
        event_id,
      );

      incentives = fetchIncentives.map(incentive => {
        incentive.options.sort((a, b) => b.total - a.total);
        return incentive;
      });

      await this.cacheProvider.save(
        `${INCENTIVES_LIST}:${event_id}`,
        incentives,
        true,
      );
    }

    return incentives;
  }
}

export default ListIncentivesService;
