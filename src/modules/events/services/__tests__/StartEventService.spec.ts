import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import ApplicationError from '@shared/errors/ApplicationError';
import CreateEventService from '../CreateEventService';
import StartEventService from '../StartEventService';

let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;
let startEvent: StartEventService;

describe('StartEvent', () => {
  beforeEach(() => {
    fakeEventsRepository = new FakeEventsRepository();
    createEvent = new CreateEventService(fakeEventsRepository);
    startEvent = new StartEventService(fakeEventsRepository);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 1, 1, 12);

      return customDate.getTime();
    });
  });

  it('should be able to start event', async () => {
    const event = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    const startedEvent = await startEvent.execute({ event_id: event.id });

    expect(startedEvent.active).toBe(true);
  });

  it('should not be able to start event if another event is active', async () => {
    const event1 = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    const event2 = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    await startEvent.execute({ event_id: event1.id });

    await expect(
      startEvent.execute({ event_id: event2.id }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to start a non-existing event', async () => {
    await expect(
      startEvent.execute({ event_id: 'bad' }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
