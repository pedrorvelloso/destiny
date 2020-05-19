import { injectable, inject } from 'inversify';
import IDonationsRepository from '../repositories/IDonationsRepository';
import Donation from '../infra/typeorm/entities/Donation';

@injectable()
class ListUnrevisedDonationsService {
  constructor(
    @inject('DonationsRepository')
    private DonationsRepository: IDonationsRepository,
  ) {}

  public async execute(): Promise<Donation[]> {
    const donations = this.DonationsRepository.findByReviewedStatus(false);

    return donations;
  }
}

export default ListUnrevisedDonationsService;
