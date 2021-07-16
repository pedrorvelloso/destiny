import ApplicationError from '@shared/errors/ApplicationError';
import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import User from '@modules/users/infra/typeorm/entities/User';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { EVENT_TOTAL } from '@shared/container/providers/CacheProvider/utils/prefixes';
import SaveNewDonationService from '../SaveNewDonationService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationsRepository: FakeDonationsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let reviewDonation: ReviewDonationService;
let saveNewDonation: SaveNewDonationService;
let createUser: CreateUserService;
let user: User;

describe('ReviewDonation', () => {
  beforeEach(async () => {
    fakeDonationsRepository = new FakeDonationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
    reviewDonation = new ReviewDonationService(
      fakeDonationsRepository,
      fakeUsersRepository,
      fakeCacheProvider,
    );
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    user = await createUser.execute({
      name: 'User',
      email: 'email@example.com',
      password: '123456',
    });
  });

  it('should be able to review donation', async () => {
    const donation = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    expect(donation.reviewed).toBe(false);

    await reviewDonation.execute({
      donation_id: donation.id,
      reviewer_id: user.id,
    });

    expect(donation.reviewed).toBe(true);
    expect(donation.reviewed_by).toBe(user.id);
  });

  it('should be able to invalidate total from event cache', async () => {
    const invalidate = jest.spyOn(fakeCacheProvider, 'invalidate');
    const donation = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
      event_id: 1,
    });

    await reviewDonation.execute({
      donation_id: donation.id,
      reviewer_id: user.id,
    });

    expect(invalidate).toBeCalledWith(`${EVENT_TOTAL}:${donation.event_id}`);
  });

  it('should not be able to review donation if reviewer does not exists', async () => {
    const donation = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    expect(donation.reviewed).toBe(false);

    await expect(
      reviewDonation.execute({
        donation_id: donation.id,
        reviewer_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to review non-existing donation', async () => {
    await expect(
      reviewDonation.execute({ donation_id: -1, reviewer_id: user.id }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to review the same donation twice', async () => {
    const donation = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    expect(donation.reviewed).toBe(false);

    await reviewDonation.execute({
      donation_id: donation.id,
      reviewer_id: user.id,
    });

    expect(donation.reviewed).toBe(true);

    await expect(
      reviewDonation.execute({
        donation_id: donation.id,
        reviewer_id: user.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
