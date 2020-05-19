import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import SaveNewDonationService from '../SaveNewDonationService';

let fakeDonationsRepository: FakeDonationsRepository;
let saveNewDonation: SaveNewDonationService;

describe('SaveNewDonation', () => {
  beforeEach(() => {
    fakeDonationsRepository = new FakeDonationsRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
  });

  it('should be able to save new donation', async () => {
    const donation = await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    expect(donation.amount).toBe(15);
    expect(donation.message).toBe('Donation Message');
    expect(donation.from).toBe('Donator');
  });
});
