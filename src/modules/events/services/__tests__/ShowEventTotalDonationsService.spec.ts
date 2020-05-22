import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import ApplicationError from '@shared/errors/ApplicationError';
import SaveNewDonationService from '@modules/donations/services/SaveNewDonationService';
import ReviewDonationService from '@modules/donations/services/ReviewDonationService';
import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import User from '@modules/users/infra/typeorm/entities/User';
import ShowEventTotalDonationsService from '../ShowEventTotalDonationsService';
import StartEventService from '../StartEventService';
import CreateEventService from '../CreateEventService';

let fakeEventsRepository: FakeEventsRepository;
let createEvent: CreateEventService;
let saveNewDonation: SaveNewDonationService;
let reviewDonation: ReviewDonationService;
let fakeDonationRepository: FakeDonationsRepository;
let startEvent: StartEventService;
let showEventTotalDonations: ShowEventTotalDonationsService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let user: User;

describe('ShowEventTotalDonations', () => {
  beforeEach(async () => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeDonationRepository = new FakeDonationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createEvent = new CreateEventService(fakeEventsRepository);
    startEvent = new StartEventService(fakeEventsRepository);
    saveNewDonation = new SaveNewDonationService(fakeDonationRepository);
    reviewDonation = new ReviewDonationService(
      fakeDonationRepository,
      fakeUsersRepository,
    );
    showEventTotalDonations = new ShowEventTotalDonationsService(
      fakeEventsRepository,
      fakeDonationRepository,
    );

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    user = await createUser.execute({
      name: 'User',
      email: 'email@example.com',
      password: '123456',
    });

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

    await reviewDonation.execute({
      donation_id: donation1.id,
      reviewer_id: user.id,
    });
    await reviewDonation.execute({
      donation_id: donation2.id,
      reviewer_id: user.id,
    });

    const total = await showEventTotalDonations.execute({
      event_id: event.id,
    });

    expect(total).toBe(20);
  });

  it('should not be able to show total donations if event doesnt exists', async () => {
    await expect(
      showEventTotalDonations.execute({
        event_id: -1,
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
