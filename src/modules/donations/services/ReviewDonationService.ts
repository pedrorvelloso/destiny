import { injectable, inject } from 'tsyringe';
import IDonationRepository from '../repositories/IDonationRepository';
import Donation from '../infra/typeorm/entities/Donation';

interface IRequest {
  donation_id: string;
}

@injectable()
class ReviewDonationService {
  constructor(
    @inject('DonationRepository')
    private donationRepository: IDonationRepository,
  ) {}

  public async execute({ donation_id }: IRequest): Promise<Donation> {
    const donation = await this.donationRepository.findById(donation_id);

    if (!donation) throw new Error('Donation does not exists');

    donation.reviewed = true;

    await this.donationRepository.save(donation);

    return donation;
  }
}

export default ReviewDonationService;
