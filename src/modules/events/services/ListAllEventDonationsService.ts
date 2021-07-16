import { injectable, inject } from 'inversify';

import IDonationsRepository from '@modules/donations/repositories/IDonationsRepository';
import Donation from '@modules/donations/infra/typeorm/entities/Donation';
import ApplicationError from '@shared/errors/ApplicationError';
import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IEventsRepository from '../repositories/IEventsRepository';

interface IRequest {
  event_id: number;
  pagination?: IPaginationDTO;
}

interface IResponse {
  cursor: number | null;
  hasNextPage: boolean;
  donations: Donation[];
}

@injectable()
class ListAllEventDonationsService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
  ) {}

  public async execute({ event_id, pagination }: IRequest): Promise<IResponse> {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event does not exists', 404);

    const donations = await this.donationsRepository.findByEventId({
      event_id,
      pagination,
    });

    const lastDonation = donations[donations.length - 1];
    const hasNextPage = !!(await this.donationsRepository.findById(
      lastDonation.id - 1,
    ));

    return {
      cursor: hasNextPage ? lastDonation.id : null,
      hasNextPage,
      donations,
    };
  }
}

export default ListAllEventDonationsService;
