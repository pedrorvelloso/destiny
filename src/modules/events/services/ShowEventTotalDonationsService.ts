import { injectable, inject } from 'inversify';

import IDonationsRepository from '@modules/donations/repositories/IDonationsRepository';
import ApplicationError from '@shared/errors/ApplicationError';
import IEventsRepository from '../repositories/IEventsRepository';

interface IRequest {
  event_id: string;
}

@injectable()
class ShowEventTotalDonationsService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
  ) {}

  public async execute({ event_id }: IRequest): Promise<number> {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event does not exists');

    const total =
      (await this.donationsRepository.totalByEventId(event_id)) || 0;

    return total;
  }
}

export default ShowEventTotalDonationsService;
