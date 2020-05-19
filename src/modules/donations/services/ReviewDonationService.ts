import { injectable, inject } from 'inversify';

import HttpError from '@shared/errors/HttpError';

import IDonationsRepository from '../repositories/IDonationsRepository';
import Donation from '../infra/typeorm/entities/Donation';

interface IRequest {
  donation_id: number;
}

@injectable()
class ReviewDonationService {
  constructor(
    @inject('DonationsRepository')
    private DonationsRepository: IDonationsRepository,
  ) {}

  public async execute({ donation_id }: IRequest): Promise<Donation> {
    const donation = await this.DonationsRepository.findById(donation_id);

    if (!donation || donation.reviewed)
      throw new HttpError('Error reviewing donation');

    donation.reviewed = true;

    await this.DonationsRepository.save(donation);

    return donation;
  }
}

export default ReviewDonationService;
