import ICreateEventDTO from '@modules/events/dtos/ICreateEventDTO';
import Event from '@modules/events/infra/typeorm/entities/Event';
import IEventsRepository from '../IEventsRepository';

class FakeEventsRepository implements IEventsRepository {
  private events: Event[] = [];

  public async create(eventData: ICreateEventDTO): Promise<Event> {
    const event = new Event();

    Object.assign(
      event,
      { id: this.events.length + 1, active: false },
      eventData,
    );

    this.events.push(event);

    return event;
  }
}

export default FakeEventsRepository;
