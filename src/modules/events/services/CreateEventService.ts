import { injectable, inject } from 'inversify';
import { isAfter, differenceInDays } from 'date-fns';

import ApplicationError from '@shared/errors/ApplicationError';
import Event from '../infra/typeorm/entities/Event';
import IEventsRepository from '../repositories/IEventsRepository';

interface IRequest {
  name: string;
  description: string;
  starts_at: Date;
  ends_at: Date;
}

@injectable()
class CreateEventService {
  constructor(
    @inject('EventsRepository')
    private eventsRepository: IEventsRepository,
  ) {}

  public async execute({
    name,
    description,
    starts_at,
    ends_at,
  }: IRequest): Promise<Event> {
    const isEndAfterStart = isAfter(starts_at, ends_at);
    const isBeforeToday = differenceInDays(Date.now(), starts_at) >= 0;

    if (isEndAfterStart)
      throw new ApplicationError('Start date should be before End Date');

    if (isBeforeToday)
      throw new ApplicationError(
        'Cannont create event that starts today/before today',
      );

    const event = await this.eventsRepository.create({
      name,
      description,
      starts_at,
      ends_at,
    });

    return event;
  }
}

export default CreateEventService;
