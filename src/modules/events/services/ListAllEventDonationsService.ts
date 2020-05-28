import { injectable, inject } from 'inversify';

import IDonationsRepository from '@modules/donations/repositories/IDonationsRepository';
import Donation from '@modules/donations/infra/typeorm/entities/Donation';
import ApplicationError from '@shared/errors/ApplicationError';
import IEventsRepository from '../repositories/IEventsRepository';

interface IRequest {
  event_id: number;
}

@injectable()
class ListAllEventDonationsService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
  ) {}

  public async execute({ event_id }: IRequest): Promise<Donation[]> {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event does not exists', 404);

    const donations = this.donationsRepository.findByEventId(event_id);

    return donations;
  }
}

export default ListAllEventDonationsService;
