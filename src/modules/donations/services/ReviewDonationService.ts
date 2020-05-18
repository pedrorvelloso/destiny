import { injectable, inject } from 'inversify';

import HttpError from '@shared/errors/HttpError';

import IDonationRepository from '../repositories/IDonationRepository';
import Donation from '../infra/typeorm/entities/Donation';

interface IRequest {
  donation_id: number;
}

@injectable()
class ReviewDonationService {
  constructor(
    @inject('DonationRepository')
    private donationRepository: IDonationRepository,
  ) {}

  public async execute({ donation_id }: IRequest): Promise<Donation> {
    const donation = await this.donationRepository.findById(donation_id);

    if (!donation || donation.reviewed)
      throw new HttpError('Error reviewing donation');

    donation.reviewed = true;

    await this.donationRepository.save(donation);

    return donation;
  }
}

export default ReviewDonationService;
