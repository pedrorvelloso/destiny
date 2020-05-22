import { injectable } from 'inversify';
import { getRepository, Repository } from 'typeorm';

import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import ICreateEventDTO from '@modules/events/dtos/ICreateEventDTO';

import Event from '../entities/Event';

@injectable()
class EventsRepository implements IEventsRepository {
  private ormRepository: Repository<Event>;

  constructor() {
    this.ormRepository = getRepository(Event);
  }

  public async create({
    name,
    description,
    starts_at,
    ends_at,
  }: ICreateEventDTO): Promise<Event> {
    const event = this.ormRepository.create({
      name,
      description,
      starts_at,
      ends_at,
    });

    await this.ormRepository.save(event);

    return event;
  }

  public async findById(event_id: number): Promise<Event | undefined> {
    const event = this.ormRepository.findOne({
      where: { id: event_id },
    });

    return event;
  }

  public async fetchActiveEvent(): Promise<Event | undefined> {
    const event = await this.ormRepository.findOne({
      where: {
        active: true,
      },
    });

    return event;
  }

  public async all(): Promise<Event[]> {
    const events = await this.ormRepository.find();

    return events;
  }

  public async save(event: Event): Promise<Event> {
    return this.ormRepository.save(event);
  }
}

export default EventsRepository;
