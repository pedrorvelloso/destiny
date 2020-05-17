import { injectable, inject } from 'inversify';
import IDonationRepository from '../repositories/IDonationRepository';
import Donation from '../infra/typeorm/entities/Donation';

@injectable()
class ListUnrevisedDonationsService {
  constructor(
    @inject('DonationRepository')
    private donationRepository: IDonationRepository,
  ) {}

  public async execute(): Promise<Donation[]> {
    const donations = this.donationRepository.findByReviewedStatus(false);

    return donations;
  }
}

export default ListUnrevisedDonationsService;
