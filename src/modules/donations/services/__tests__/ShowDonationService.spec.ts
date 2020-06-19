import FakeDonationsRepository from '@modules/donations/repositories/fakes/FakeDonationsRepository';
import Donation from '@modules/donations/infra/typeorm/entities/Donation';
import ApplicationError from '@shared/errors/ApplicationError';
import ShowDonationService from '../ShowDonationService';

let showDonation: ShowDonationService;
let fakeDonationsRepository: FakeDonationsRepository;
let donation: Donation;

describe('ShowDonation', () => {
  beforeEach(async () => {
    fakeDonationsRepository = new FakeDonationsRepository();
    showDonation = new ShowDonationService(fakeDonationsRepository);

    donation = await fakeDonationsRepository.create({
      from: 'Donator',
      message: 'Donation!',
      amount: 10,
      source: 'Listener',
    });
  });

  it('should be able to show donation', async () => {
    const response = await showDonation.execute({ id: donation.id });

    expect(response).toHaveProperty('id');
  });

  it('should not be able to show non-existing donation', async () => {
    await expect(showDonation.execute({ id: -1 })).rejects.toBeInstanceOf(
      ApplicationError,
    );
  });
});
