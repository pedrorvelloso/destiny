import { injectable, inject } from 'inversify';
import IDonationsRepository from '../repositories/IDonationsRepository';

@injectable()
class TotalDonationService {
  constructor(
    @inject('DonationsRepository')
    private DonationsRepository: IDonationsRepository,
  ) {}

  public async execute(): Promise<number> {
    const total = this.DonationsRepository.total();

    return total;
  }
}

export default TotalDonationService;
