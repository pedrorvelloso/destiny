import ICreateEventDTO from '@modules/events/dtos/ICreateEventDTO';
import Event from '@modules/events/infra/typeorm/entities/Event';
import IEventsRepository from '../IEventsRepository';

class FakeEventsRepository implements IEventsRepository {
  private events: Event[] = [];

  public async findById(id: string): Promise<Event | undefined> {
    const findEvent = this.events.find(event => event.id === id);

    return findEvent;
  }

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

  public async all(): Promise<Event[]> {
    return this.events;
  }

  public async save(event: Event): Promise<Event> {
    const findIndex = this.events.findIndex(e => e.id === event.id);

    this.events[findIndex] = event;

    return event;
  }

  public async fetchActiveEvent(): Promise<Event | undefined> {
    return this.events.find(event => event.active);
  }
}

export default FakeEventsRepository;
