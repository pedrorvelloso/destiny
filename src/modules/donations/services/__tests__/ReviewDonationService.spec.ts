import FakeDonationRepository from '@modules/donations/repositories/fakes/FakeDonationRepository';
import HttpError from '@shared/errors/HttpError';
import SaveNewDonationService from '../SaveNewDonationService';
import ReviewDonationService from '../ReviewDonationService';

let fakeDonationRepository: FakeDonationRepository;
let reviewDonation: ReviewDonationService;
let saveNewDonation: SaveNewDonationService;

describe('ReviewDonation', () => {
  beforeEach(() => {
    fakeDonationRepository = new FakeDonationRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationRepository);
    reviewDonation = new ReviewDonationService(fakeDonationRepository);
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
      donation_id: donation._id,
    });

    expect(donation.reviewed).toBe(true);
  });

  it('should not be able to review non-existing donation', async () => {
    await expect(
      reviewDonation.execute({ donation_id: 'non-existing' }),
    ).rejects.toBeInstanceOf(HttpError);
  });

  it('should be able to review the same donation twice', async () => {
    const donation = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    expect(donation.reviewed).toBe(false);

    await reviewDonation.execute({
      donation_id: donation._id,
    });

    expect(donation.reviewed).toBe(true);

    await expect(
      reviewDonation.execute({
        donation_id: donation._id,
      }),
    ).rejects.toBeInstanceOf(HttpError);
  });
});
