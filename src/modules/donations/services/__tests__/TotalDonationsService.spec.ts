import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import User from '@modules/users/infra/typeorm/entities/User';
import SaveNewDonationService from '../SaveNewDonationService';
import TotalDonationService from '../TotalDonationsService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationsRepository: FakeDonationsRepository;
let totalDonations: TotalDonationService;
let saveNewDonation: SaveNewDonationService;
let reviewDonation: ReviewDonationService;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let user: User;

describe('TotalDonations', () => {
  beforeEach(async () => {
    fakeDonationsRepository = new FakeDonationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
    reviewDonation = new ReviewDonationService(
      fakeDonationsRepository,
      fakeUsersRepository,
    );
    totalDonations = new TotalDonationService(fakeDonationsRepository);

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    user = await createUser.execute({
      name: 'User',
      email: 'email@example.com',
      password: '123456',
    });
  });

  it('should be able to fetch total reviewed donations number', async () => {
    await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    const d2 = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    await reviewDonation.execute({ donation_id: d2.id, reviewer_id: user.id });

    const total = await totalDonations.execute();

    expect(total).toBe(15);
  });
});
