import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import ApplicationError from '@shared/errors/ApplicationError';
import SaveNewDonationService from '@modules/donations/services/SaveNewDonationService';
import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import CreateEventService from '../CreateEventService';
import ListAllEventDonationsService from '../ListAllEventDonationsService';

let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;
let saveNewDonation: SaveNewDonationService;
let fakeDonationRepository: FakeDonationsRepository;
let listAllEventDonations: ListAllEventDonationsService;

describe('ListAllEventDonations', () => {
  beforeEach(async () => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeDonationRepository = new FakeDonationsRepository();
    createEvent = new CreateEventService(fakeEventsRepository);
    saveNewDonation = new SaveNewDonationService(fakeDonationRepository);
    listAllEventDonations = new ListAllEventDonationsService(
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

    await saveNewDonation.execute({
      from: 'Donator',
      message: 'Nice Message!',
      amount: 10,
      source: 'Source',
      event_id: event.id,
    });

    await saveNewDonation.execute({
      from: 'Donator',
      message: 'Nice Message!',
      amount: 10,
      source: 'Source',
      event_id: event.id,
    });

    const donations = await listAllEventDonations.execute({
      event_id: event.id,
    });

    expect(donations.length).toBe(2);
  });

  it('should not be able to show total donations if event doesnt exists', async () => {
    await expect(
      listAllEventDonations.execute({
        event_id: -1,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
