import FakeDonationRepository from '../../repositories/fakes/FakeDonationRepository';
import SaveNewDonationService from '../SaveNewDonationService';
import ListUnrevisedDonationsService from '../ListUnreviewedDonationsService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationRepository: FakeDonationRepository;
let listUnrevisedDonations: ListUnrevisedDonationsService;
let reviewDonation: ReviewDonationService;
let saveNewDonation: SaveNewDonationService;

describe('ListAllUnrevisedDonations', () => {
  beforeEach(() => {
    fakeDonationRepository = new FakeDonationRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationRepository);
    reviewDonation = new ReviewDonationService(fakeDonationRepository);
    listUnrevisedDonations = new ListUnrevisedDonationsService(
      fakeDonationRepository,
    );
  });

  it('should be able to list all unrevised donations', async () => {
    const shouldBeReviewd = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 35,
      source: 'SomeListener',
    });

    await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 35,
      source: 'SomeListener',
    });

    await reviewDonation.execute({ donation_id: shouldBeReviewd.id });

    const donations = await listUnrevisedDonations.execute();

    expect(donations.length).toBe(2);
  });
});
