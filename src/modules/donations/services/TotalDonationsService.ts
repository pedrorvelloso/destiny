import { injectable, inject } from 'inversify';
import IDonationsRepository from '../repositories/IDonationsRepository';

@injectable()
class TotalDonationService {
  constructor(
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = this.donationsRepository.total();

    return total;
  }
}

export default TotalDonationService;
