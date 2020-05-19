import { injectable, inject } from 'inversify';
import Donation from '../infra/typeorm/entities/Donation';
import IDonationsRepository from '../repositories/IDonationsRepository';

interface IRequest {
  from: string;
  message: string;
  amount: number;
  source: string;
}

@injectable()
class SaveNewDonationService {
  constructor(
    @inject('DonationsRepository')
    private DonationsRepository: IDonationsRepository,
  ) {}

  public async execute({
    from,
    message,
    amount,
    source,
  }: IRequest): Promise<Donation> {
    const donation = await this.DonationsRepository.create({
      from,
      amount,
      message,
      source,
    });

    return donation;
  }
}

export default SaveNewDonationService;
