import { injectable, inject } from 'inversify';
import ApplicationError from '@shared/errors/ApplicationError';
import IDonationsRepository from '../repositories/IDonationsRepository';
import Donation from '../infra/typeorm/entities/Donation';

interface IRequest {
  id: number;
}

@injectable()
class ShowDonationService {
  constructor(
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Donation> {
    const donation = await this.donationsRepository.findById(id);

    if (!donation) throw new ApplicationError('Donation not found', 404);

    return donation;
  }
}

export default ShowDonationService;
