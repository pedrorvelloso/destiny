import { injectable, inject } from 'inversify';

import Event from '../infra/typeorm/entities/Event';
import IEventsRepository from '../repositories/IEventsRepository';

@injectable()
class ListEventsService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {}

  public async execute(): Promise<Event[]> {
    const event = await this.eventsRepository.all();

    return event;
  }
}

export default ListEventsService;
