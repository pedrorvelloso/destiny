import { injectable, inject } from 'tsyringe';
import Donation from '../infra/typeorm/entities/Donation';
import IDonationRepository from '../repositories/IDonationRepository';

interface IRequest {
  from: string;
  message: string;
  amount: number;
  source: string;
}

@injectable()
class SaveNewDonationService {
  constructor(
    @inject('DonationRepository')
    private donationRepository: IDonationRepository,
  ) {}

  public async execute({
    from,
    message,
    amount,
    source,
  }: IRequest): Promise<Donation> {
    const donation = await this.donationRepository.create({
      from,
      amount,
      message,
      source,
    });

    return donation;
  }
}

export default SaveNewDonationService;
