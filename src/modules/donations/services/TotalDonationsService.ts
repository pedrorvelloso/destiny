import { injectable, inject } from 'inversify';
import IDonationRepository from '../repositories/IDonationRepository';

@injectable()
class TotalDonationService {
  constructor(
    @inject('DonationRepository')
    private donationRepository: IDonationRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = this.donationRepository.total();

    return total;
  }
}

export default TotalDonationService;
