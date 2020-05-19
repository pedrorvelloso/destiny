import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import CreateEventService from '../CreateEventService';
import ListEventsService from '../ListEventsService';

let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;
let listEvents: ListEventsService;

describe('ListEvents', () => {
  beforeEach(() => {
    fakeEventsRepository = new FakeEventsRepository();
    createEvent = new CreateEventService(fakeEventsRepository);
    listEvents = new ListEventsService(fakeEventsRepository);
  });

  it('should be able to list events', async () => {
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

    await createEvent.execute({
      name: 'Super Fast Event 2',
      description: 'Super fast description',
      starts_at: new Date(2021, 3, 15, 12),
      ends_at: new Date(2021, 3, 20, 12),
    });

    const events = await listEvents.execute();

    expect(events.length).toBe(2);
  });
});
