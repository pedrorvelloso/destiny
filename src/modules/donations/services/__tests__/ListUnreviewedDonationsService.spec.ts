import ApplicationError from '@shared/errors/ApplicationError';
import FakeEventsRepository from '@modules/events/repositories/fakes/FakeEventsRespository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import User from '@modules/users/infra/typeorm/entities/User';
import CreateEventService from '@modules/events/services/CreateEventService';
import FakeDonationsRepository from '../../repositories/fakes/FakeDonationsRepository';
import SaveNewDonationService from '../SaveNewDonationService';
import ListUnreviewedDonationsService from '../ListUnreviewedDonationsService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationsRepository: FakeDonationsRepository;
let fakeEventsRepository: FakeEventsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createEvent: CreateEventService;
let listUnreviewedDonations: ListUnreviewedDonationsService;
let reviewDonation: ReviewDonationService;
let saveNewDonation: SaveNewDonationService;
let createUser: CreateUserService;
let user: User;

describe('ListAllUnrevisedDonations', () => {
  beforeEach(async () => {
    fakeDonationsRepository = new FakeDonationsRepository();
    fakeEventsRepository = new FakeEventsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createEvent = new CreateEventService(fakeEventsRepository);
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
    reviewDonation = new ReviewDonationService(
      fakeDonationsRepository,
      fakeUsersRepository,
    );
    listUnreviewedDonations = new ListUnreviewedDonationsService(
      fakeDonationsRepository,
      fakeEventsRepository,
    );
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    user = await createUser.execute({
      name: 'User',
      email: 'email@example.com',
      password: '123456',
    });
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

    await reviewDonation.execute({
      donation_id: shouldBeReviewd.id,
      reviewer_id: user.id,
    });

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
