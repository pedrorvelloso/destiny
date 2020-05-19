import { injectable, inject } from 'inversify';
import Donation from '../infra/typeorm/entities/Donation';
import IDonationsRepository from '../repositories/IDonationsRepository';

interface IRequest {
  from: string;
  message: string;
  amount: number;
  source: string;
  event_id?: string;
}

@injectable()
class SaveNewDonationService {
  constructor(
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
  ) {}

  public async execute({
    from,
    message,
    amount,
    source,
    event_id,
  }: IRequest): Promise<Donation> {
    const donation = await this.donationsRepository.create({
      from,
      amount,
      message,
      source,
      event_id,
    });

    return donation;
  }
}

export default SaveNewDonationService;
