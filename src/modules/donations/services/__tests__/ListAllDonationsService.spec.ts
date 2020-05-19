import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import SaveNewDonationService from '../SaveNewDonationService';
import ListAllDonationService from '../ListAllDonationsService';

let fakeDonationsRepository: FakeDonationsRepository;
let listAllDonations: ListAllDonationService;
let saveNewDonation: SaveNewDonationService;

describe('ListAllDonations', () => {
  beforeEach(() => {
    fakeDonationsRepository = new FakeDonationsRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationsRepository);
    listAllDonations = new ListAllDonationService(fakeDonationsRepository);
  });

  it('should be able to list all donations', async () => {
    await saveNewDonation.execute({
      from: 'Donator',
      message: 'Donation Message',
      amount: 15,
      source: 'SomeListener',
    });

    const donations = await listAllDonations.execute();

    expect(donations.length).toBe(1);
    expect(donations.find(d => d.from === 'Donator')).toBeDefined();
  });
});
