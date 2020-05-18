import Event from '../infra/typeorm/entities/Event';
import ICreateEventDTO from '../dtos/ICreateEventDTO';

export default interface IEventsRepository {
  create(data: ICreateEventDTO): Promise<Event>;
}
