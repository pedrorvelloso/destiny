import FakeDonationRepository from '@modules/donations/repositories/fakes/FakeDonationRepository';
import SaveNewDonationService from '../SaveNewDonationService';
import ListAllDonationService from '../ListAllDonationsService';

let fakeDonationRepository: FakeDonationRepository;
let listAllDonations: ListAllDonationService;
let saveNewDonation: SaveNewDonationService;

describe('ListAllDonations', () => {
  beforeEach(() => {
    fakeDonationRepository = new FakeDonationRepository();
    saveNewDonation = new SaveNewDonationService(fakeDonationRepository);
    listAllDonations = new ListAllDonationService(fakeDonationRepository);
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
