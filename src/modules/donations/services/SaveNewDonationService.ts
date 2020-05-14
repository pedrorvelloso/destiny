import Donation from '../infra/typeorm/entities/Donation';
import IDonationRepository from '../repositories/IDonationRepository';

interface IRequest {
  from: string;
  message: string;
  amount: number;
}

class SaveNewDonationService {
  constructor(private donationRepository: IDonationRepository) {}

  public async execute({ from, message, amount }: IRequest): Promise<Donation> {
    const donation = await this.donationRepository.create({
      from,
      amount,
      message,
    });

    return donation;
  }
}

export default SaveNewDonationService;
