import Event from '../infra/typeorm/entities/Event';

import ICreateEventDTO from '../dtos/ICreateEventDTO';

export default interface IEventsRepository {
  findById(event_id: number): Promise<Event | undefined>;
  create(data: ICreateEventDTO): Promise<Event>;
  all(): Promise<Event[]>;
  save(event: Event): Promise<Event>;
  fetchActiveEvent(): Promise<Event | undefined>;
}
