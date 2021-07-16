import { injectable, inject } from 'inversify';

import IDonationsRepository from '@modules/donations/repositories/IDonationsRepository';
import ApplicationError from '@shared/errors/ApplicationError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { EVENT_TOTAL } from '@shared/container/providers/CacheProvider/utils/prefixes';
import IEventsRepository from '../repositories/IEventsRepository';

interface IRequest {
  event_id: number;
}

@injectable()
class ShowEventTotalDonationsService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ event_id }: IRequest): Promise<number> {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event does not exists', 404);

    let total = await this.cacheProvider.get<number>(
      `${EVENT_TOTAL}:${event_id}`,
    );

    if (!total) {
      total = (await this.donationsRepository.totalByEventId(event_id)) || 0;

      await this.cacheProvider.save(`${EVENT_TOTAL}:${event_id}`, total);
    }

    return total;
  }
}

export default ShowEventTotalDonationsService;
