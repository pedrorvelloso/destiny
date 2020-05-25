import { injectable, inject } from 'inversify';

import ApplicationError from '@shared/errors/ApplicationError';
import Event from '../infra/typeorm/entities/Event';
import IEventsRepository from '../repositories/IEventsRepository';

@injectable()
class ShowActiveEventService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {}

  public async execute(): Promise<Event> {
    const event = await this.eventsRepository.fetchActiveEvent();

    if (!event) throw new ApplicationError('Theres is no active event');

    return event;
  }
}

export default ShowActiveEventService;
