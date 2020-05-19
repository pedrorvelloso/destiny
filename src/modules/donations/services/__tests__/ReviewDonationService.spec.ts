import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import HttpError from '@shared/errors/HttpError';
import SaveNewDonationService from '../SaveNewDonationService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationsRepository: FakeDonationsRepository;
let reviewDonation: ReviewDonationService;
let saveNewDonation: SaveNewDonationService;

describe('ReviewDonation', () => {
  beforeEach(() => {
    fakeDonationsRepository = new FakeDonationsRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
    reviewDonation = new ReviewDonationService(fakeDonationsRepository);
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
    });

    expect(donation.reviewed).toBe(true);
  });

  it('should not be able to review non-existing donation', async () => {
    await expect(
      reviewDonation.execute({ donation_id: -1 }),
    ).rejects.toBeInstanceOf(HttpError);
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
    });

    expect(donation.reviewed).toBe(true);

    await expect(
      reviewDonation.execute({
        donation_id: donation.id,
      }),
    ).rejects.toBeInstanceOf(HttpError);
  });
});
