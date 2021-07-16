import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeIncentiveOptionsRepository from '@modules/incentives/repositories/fakes/FakeIncentiveOptionsRepository';
import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import Donation from '@modules/donations/infra/typeorm/entities/Donation';
import User from '@modules/users/infra/typeorm/entities/User';
import IncentiveOption from '@modules/incentives/infra/typeorm/entities/IncentiveOption';
import ApplicationError from '@shared/errors/ApplicationError';
import FakeIncentivesRepository from '@modules/incentives/repositories/fakes/FakeIncentivesRepository';
import Incentive, {
  IIncentiveType,
} from '@modules/incentives/infra/typeorm/entities/Incentive';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { INCENTIVES_LIST } from '@shared/container/providers/CacheProvider/utils/prefixes';
import AllocateDonationToIncentiveService from '../AllocateDonationToIncentiveService';

let fakeUsersRepository: FakeUsersRepository;
let fakeDonationsRepository: FakeDonationsRepository;
let fakeIncentiveOptionsRepository: FakeIncentiveOptionsRepository;
let fakeIncentivesRepository: FakeIncentivesRepository;
let fakeCacheProvider: FakeCacheProvider;
let allocateDonationToIncentive: AllocateDonationToIncentiveService;
let donation: Donation;
let user: User;
let incentive: Incentive;
let incentiveOption: IncentiveOption;

describe('AllocateDonationToIncentive', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeDonationsRepository = new FakeDonationsRepository();
    fakeIncentiveOptionsRepository = new FakeIncentiveOptionsRepository();
    fakeIncentivesRepository = new FakeIncentivesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    allocateDonationToIncentive = new AllocateDonationToIncentiveService(
      fakeIncentiveOptionsRepository,
      fakeDonationsRepository,
      fakeUsersRepository,
      fakeIncentivesRepository,
      fakeCacheProvider,
    );

    donation = await fakeDonationsRepository.create({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'Listener',
      event_id: 1,
    });
    user = await fakeUsersRepository.create({
      name: 'User',
      email: 'user@email.com',
      password: 'password',
    });
    incentive = await fakeIncentivesRepository.create({
      name: 'Incentive',
      description: 'Incentive Description',
      enable_option: true,
      event_id: 1,
      game_id: 1,
      type: IIncentiveType.OPTION,
      created_by: user.id,
    });
    incentiveOption = await fakeIncentiveOptionsRepository.create({
      created_by: user.id,
      incentive_id: incentive.id,
      name: 'Option 1',
    });
  });

  it('should be able to allocate donation', async () => {
    const allocatedDonation = await allocateDonationToIncentive.execute({
      user_id: user.id,
      donation_id: donation.id,
      incentive_option_id: incentiveOption.id,
    });

    expect(allocatedDonation.donation_incentive).toBe(incentiveOption.id);
  });

  it('should be able to invalidate incentive lists from event cache', async () => {
    const invalidate = jest.spyOn(fakeCacheProvider, 'invalidate');

    await allocateDonationToIncentive.execute({
      user_id: user.id,
      donation_id: donation.id,
      incentive_option_id: incentiveOption.id,
    });

    expect(invalidate).toBeCalledWith(`${INCENTIVES_LIST}:1`);
  });

  it('should not be able to allocate donation if user/donation/option does not exist', async () => {
    await expect(
      allocateDonationToIncentive.execute({
        user_id: 'bad',
        donation_id: donation.id,
        incentive_option_id: incentiveOption.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
    await expect(
      allocateDonationToIncentive.execute({
        user_id: user.id,
        donation_id: 0,
        incentive_option_id: incentiveOption.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
    await expect(
      allocateDonationToIncentive.execute({
        user_id: user.id,
        donation_id: donation.id,
        incentive_option_id: 0,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });

  it('should not be able to allocate donation if incentive is over', async () => {
    const incentive_new = await fakeIncentivesRepository.create({
      name: 'Incentive',
      description: 'Incentive Description',
      enable_option: true,
      event_id: 1,
      game_id: 1,
      type: IIncentiveType.OPTION,
      created_by: user.id,
    });

    incentive_new.ended_at = new Date();

    await fakeIncentivesRepository.save(incentive_new);

    const incentiveOption_new = await fakeIncentiveOptionsRepository.create({
      created_by: user.id,
      incentive_id: incentive_new.id,
      name: 'Option 1',
    });

    await expect(
      allocateDonationToIncentive.execute({
        user_id: user.id,
        donation_id: donation.id,
        incentive_option_id: incentiveOption_new.id,
      }),
    ).rejects.toBeInstanceOf(ApplicationError);
  });
});
