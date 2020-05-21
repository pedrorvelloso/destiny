import { injectable, inject } from 'inversify';

import ApplicationError from '@shared/errors/ApplicationError';
import Event from '../infra/typeorm/entities/Event';
import IEventsRepository from '../repositories/IEventsRepository';

interface IRequest {
  event_id: number;
}

@injectable()
class StartEventService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {}

  public async execute({ event_id }: IRequest): Promise<Event> {
    const hasActiveEvent = await this.eventsRepository.fetchActiveEvent();

    if (hasActiveEvent)
      throw new ApplicationError('There is already an event going on');

    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event not found');

    event.active = true;
    await this.eventsRepository.save(event);

    return event;
  }
}

export default StartEventService;
