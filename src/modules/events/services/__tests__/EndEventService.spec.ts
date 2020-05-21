import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import ApplicationError from '@shared/errors/ApplicationError';
import CreateEventService from '../CreateEventService';
import StartEventService from '../StartEventService';
import EndEventService from '../EndEventService';

let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;
let startEvent: StartEventService;
let endEvent: EndEventService;

describe('EndEvent', () => {
  beforeEach(() => {
    fakeEventsRepository = new FakeEventsRepository();
    createEvent = new CreateEventService(fakeEventsRepository);
    startEvent = new StartEventService(fakeEventsRepository);
    endEvent = new EndEventService(fakeEventsRepository);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 1, 1, 12);

      return customDate.getTime();
    });
  });

  it('should be able to end event', async () => {
    const event = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    await startEvent.execute({ event_id: event.id });

    const endedEvent = await endEvent.execute({ event_id: event.id });

    expect(endedEvent.active).toBe(false);
    expect(!!endedEvent.ended_at).toBeTruthy();
  });

  it('should not be able to end an unstarted event', async () => {
    const event = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    await expect(
      endEvent.execute({ event_id: event.id }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to end event that is already ended', async () => {
    const event = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    await startEvent.execute({ event_id: event.id });

    await endEvent.execute({ event_id: event.id });

    await expect(
      endEvent.execute({ event_id: event.id }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to end event that not exists', async () => {
    await expect(endEvent.execute({ event_id: -1 })).rejects.toBeInstanceOf(
      ApplicationError,
    );
  });
});
