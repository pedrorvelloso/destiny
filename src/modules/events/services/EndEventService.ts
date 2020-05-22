import { injectable, inject } from 'inversify';

import ApplicationError from '@shared/errors/ApplicationError';
import Event from '../infra/typeorm/entities/Event';
import IEventsRepository from '../repositories/IEventsRepository';

interface IRequest {
  event_id: number;
}

@injectable()
class EndEventService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {}

  public async execute({ event_id }: IRequest): Promise<Event> {
    const event = await this.eventsRepository.findById(event_id);

    if (!event) throw new ApplicationError('Event not found');

    if (!event.active || !!event.ended_at)
      throw new ApplicationError('Event is not active or already ended');

    event.active = false;
    event.ended_at = new Date();
    await this.eventsRepository.save(event);

    return event;
  }
}

export default EndEventService;
