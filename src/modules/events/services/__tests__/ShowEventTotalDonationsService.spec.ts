import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import ApplicationError from '@shared/errors/ApplicationError';
import SaveNewDonationService from '@modules/donations/services/SaveNewDonationService';
import ReviewDonationService from '@modules/donations/services/ReviewDonationService';
import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import CreateEventService from '../CreateEventService';
import StartEventService from '../StartEventService';
import ShowEventTotalDonationsService from '../ShowEventTotalDonationsService';

let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;
let saveNewDonation: SaveNewDonationService;
let reviewDonation: ReviewDonationService;
let fakeDonationRepository: FakeDonationsRepository;
let startEvent: StartEventService;
let showEventTotalDonations: ShowEventTotalDonationsService;

describe('ShowEventTotalDonations', () => {
  beforeEach(() => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeDonationRepository = new FakeDonationsRepository();
    createEvent = new CreateEventService(fakeEventsRepository);
    startEvent = new StartEventService(fakeEventsRepository);
    saveNewDonation = new SaveNewDonationService(fakeDonationRepository);
    reviewDonation = new ReviewDonationService(fakeDonationRepository);
    showEventTotalDonations = new ShowEventTotalDonationsService(
      fakeEventsRepository,
      fakeDonationRepository,
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date(2020, 1, 1, 12);

      return customDate.getTime();
    });
  });

  it('should be able to show total donations from active event', async () => {
    const event = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    await startEvent.execute({ event_id: event.id });

    const donation1 = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Nice Message!',
      amount: 10,
      source: 'Source',
      event_id: event.id,
    });

    const donation2 = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Nice Message!',
      amount: 10,
      source: 'Source',
      event_id: event.id,
    });

    await reviewDonation.execute({ donation_id: donation1.id });
    await reviewDonation.execute({ donation_id: donation2.id });

    const total = await showEventTotalDonations.execute({
      event_id: event.id,
    });

    expect(total).toBe(20);
  });

  it('should not be able to show total donations if event doesnt exists', async () => {
    await expect(
      showEventTotalDonations.execute({
        event_id: 'bad',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should show 0 if there is no donations', async () => {
    const event = await createEvent.execute({
      name: 'Super Fast Event',
      description: 'Super fast description',
      starts_at: new Date(2020, 3, 15, 12),
      ends_at: new Date(2020, 3, 20, 12),
    });

    const total = await showEventTotalDonations.execute({
      event_id: event.id,
    });

    expect(total).toBe(0);
  });
});
