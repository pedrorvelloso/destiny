import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import HttpError from '@shared/errors/HttpError';
import CreateEventService from '../CreateEventService';

let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;

describe('CreateEvent', () => {
  beforeEach(() => {
    fakeEventsRepository = new FakeEventsRepository();
    createEvent = new CreateEventService(fakeEventsRepository);
  });

  it('should be able to create event', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 1, 1, 12);

      return customDate.getTime();
    });

    const event = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    expect(event.name).toBe('Super Fast Event');
    expect(event.description).toBe('Super fast description');
  });

  it('should not be able to create event when start date is after end date', async () => {
    await expect(
      createEvent.execute({
        name: 'Super Fast Event',
        description: 'Super fast description',
        starts_at: new Date(2020, 1, 7, 12),
        ends_at: new Date(2020, 1, 6, 12),
      }),
    ).rejects.toBeInstanceOf(HttpError);
  });

  it('should not be able to create event the same day it starts or before', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 1, 1);

      return customDate.getTime();
    });

    const startDate = new Date(2020, 1, 1);
    const endDate = new Date();
    endDate.setHours(startDate.getHours() + 3);
    await expect(
      createEvent.execute({
        name: 'Super Fast Event',
        description: 'Super fast description',
        starts_at: startDate,
        ends_at: endDate,
      }),
    ).rejects.toBeInstanceOf(HttpError);
  });
});
