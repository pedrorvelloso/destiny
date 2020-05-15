import FakeDonationRepository from '@modules/donations/repositories/fakes/FakeDonationRepository';
import SaveNewDonationService from '../SaveNewDonationService';

let fakeDonationRepository: FakeDonationRepository;
let saveNewDonation: SaveNewDonationService;

describe('SaveNewDonation', () => {
  beforeEach(() => {
    fakeDonationRepository = new FakeDonationRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationRepository);
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
