import FakeDonationsRepository from '../../repositories/fakes/FakeDonationsRepository';
import SaveNewDonationService from '../SaveNewDonationService';
import ListUnrevisedDonationsService from '../ListUnreviewedDonationsService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationsRepository: FakeDonationsRepository;
let listUnrevisedDonations: ListUnrevisedDonationsService;
let reviewDonation: ReviewDonationService;
let saveNewDonation: SaveNewDonationService;

describe('ListAllUnrevisedDonations', () => {
  beforeEach(() => {
    fakeDonationsRepository = new FakeDonationsRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
    reviewDonation = new ReviewDonationService(fakeDonationsRepository);
    listUnrevisedDonations = new ListUnrevisedDonationsService(
      fakeDonationsRepository,
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
