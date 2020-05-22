import { injectable, inject } from 'inversify';
import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import ApplicationError from '@shared/errors/ApplicationError';
import IDonationsRepository from '../repositories/IDonationsRepository';
import Donation from '../infra/typeorm/entities/Donation';

interface IRequest {
  event_id: number;
}

@injectable()
class ListUnrevisedDonationsService {
  constructor(
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {}

  public async execute({ event_id }: IRequest): Promise<Donation[]> {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event not found');

    const donations = this.donationsRepository.findByReviewedStatus({
      event_id,
      reviewed: false,
    });

    return donations;
  }
}

export default ListUnrevisedDonationsService;
