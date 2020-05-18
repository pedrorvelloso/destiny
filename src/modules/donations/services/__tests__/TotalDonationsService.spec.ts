import FakeDonationRepository from '@modules/donations/repositories/fakes/FakeDonationRepository';
import SaveNewDonationService from '../SaveNewDonationService';
import TotalDonationService from '../TotalDonationsService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationRepository: FakeDonationRepository;
let totalDonations: TotalDonationService;
let saveNewDonation: SaveNewDonationService;
let reviewDonation: ReviewDonationService;

describe('TotalDonations', () => {
  beforeEach(() => {
    fakeDonationRepository = new FakeDonationRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationRepository);
    reviewDonation = new ReviewDonationService(fakeDonationRepository);
    totalDonations = new TotalDonationService(fakeDonationRepository);
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
