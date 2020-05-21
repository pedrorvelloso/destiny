import ApplicationError from '@shared/errors/ApplicationError';
import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import CreateEventService from '@modules/events/services/CreateEventService';
import FakeDonationsRepository from '../../repositories/fakes/FakeDonationsRepository';
import SaveNewDonationService from '../SaveNewDonationService';
import ListUnreviewedDonationsService from '../ListUnreviewedDonationsService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationsRepository: FakeDonationsRepository;
let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;
let listUnreviewedDonations: ListUnreviewedDonationsService;
let reviewDonation: ReviewDonationService;
let saveNewDonation: SaveNewDonationService;

describe('ListAllUnrevisedDonations', () => {
  beforeEach(() => {
    fakeDonationsRepository = new FakeDonationsRepository();
    fakeEventsRepository = new FakeEventsRepository();
    createEvent = new CreateEventService(fakeEventsRepository);
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
    reviewDonation = new ReviewDonationService(fakeDonationsRepository);
    listUnreviewedDonations = new ListUnreviewedDonationsService(
      fakeDonationsRepository,
      fakeEventsRepository,
    );
  });

  it('should be able to list all unrevised donations', async () => {
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

    const shouldBeReviewd = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
      event_id: event.id,
    });

    await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 35,
      source: 'SomeListener',
      event_id: event.id,
    });

    await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 35,
      source: 'SomeListener',
      event_id: event.id,
    });

    await reviewDonation.execute({ donation_id: shouldBeReviewd.id });

    const donations = await listUnreviewedDonations.execute({
      event_id: event.id,
    });

    expect(donations.length).toBe(2);
  });

  it('should not be able to list unreviewed from non-existing event', async () => {
    await expect(
      listUnreviewedDonations.execute({ event_id: -1 }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
