import ApplicationError from '@shared/errors/ApplicationError';
import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import CreateEventService from '../CreateEventService';
import ShowActiveEventService from '../ShowActiveEventService';
import StartEventService from '../StartEventService';

let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;
let showActiveEvent: ShowActiveEventService;
let startEvent: StartEventService;

describe('ShowActiveEvent', () => {
  beforeEach(() => {
    fakeEventsRepository = new FakeEventsRepository();
    createEvent = new CreateEventService(fakeEventsRepository);
    showActiveEvent = new ShowActiveEventService(fakeEventsRepository);
    startEvent = new StartEventService(fakeEventsRepository);
  });

  it('should be able to list active event', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 1, 1, 12);

      return customDate.getTime();
    });

    await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    const event = await createEvent.execute({
      name: 'Super Fast Event 2',
      description: 'Super fast description',
      starts_at: new Date(2021, 3, 15, 12),
      ends_at: new Date(2021, 3, 20, 12),
    });

    await startEvent.execute({ event_id: event.id });

    const activeEvent = await showActiveEvent.execute();

    expect(activeEvent.id).toBe(event.id);
  });

  it('should not be able to list active event if there is no started event', async () => {
    await expect(showActiveEvent.execute()).rejects.toBeInstanceOf(
      ApplicationError,
    );
  });
});
