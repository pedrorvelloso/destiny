import { injectable, inject } from 'inversify';
import IDonationsRepository from '../repositories/IDonationsRepository';
import Donation from '../infra/typeorm/entities/Donation';

@injectable()
class ListAllDonationsService {
  constructor(
    @inject('DonationsRepository')
    private DonationsRepository: IDonationsRepository,
  ) {}

  public async execute(): Promise<Donation[]> {
    const donations = this.DonationsRepository.all();

    return donations;
  }
}

export default ListAllDonationsService;
