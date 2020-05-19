import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import SaveNewDonationService from '../SaveNewDonationService';
import TotalDonationService from '../TotalDonationsService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationsRepository: FakeDonationsRepository;
let totalDonations: TotalDonationService;
let saveNewDonation: SaveNewDonationService;
let reviewDonation: ReviewDonationService;

describe('TotalDonations', () => {
  beforeEach(() => {
    fakeDonationsRepository = new FakeDonationsRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
    reviewDonation = new ReviewDonationService(fakeDonationsRepository);
    totalDonations = new TotalDonationService(fakeDonationsRepository);
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

    await reviewDonation.execute({ donation_id: d2.id });

    const total = await totalDonations.execute();

    expect(total).toBe(15);
  });
});
