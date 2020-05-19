import { injectable, inject } from 'inversify';
import IDonationsRepository from '../repositories/IDonationsRepository';
import Donation from '../infra/typeorm/entities/Donation';

@injectable()
class ListAllDonationsService {
  constructor(
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
  ) {}

  public async execute(): Promise<Donation[]> {
    const donations = this.donationsRepository.all();

    return donations;
  }
}

export default ListAllDonationsService;
