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
}

export default EventsRepository;
