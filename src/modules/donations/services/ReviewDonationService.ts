import { injectable, inject } from 'inversify';

import ApplicationError from '@shared/errors/ApplicationError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IDonationsRepository from '../repositories/IDonationsRepository';
import Donation from '../infra/typeorm/entities/Donation';

interface IRequest {
  donation_id: number;
  reviewer_id: string;
}

@injectable()
class ReviewDonationService {
  constructor(
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    donation_id,
    reviewer_id,
  }: IRequest): Promise<Donation> {
    const user = await this.usersRepository.findById(reviewer_id);

    if (!user) throw new ApplicationError('User does not exists');

    const donation = await this.donationsRepository.findById(donation_id);

    if (!donation || donation.reviewed)
      throw new ApplicationError('Error reviewing donation');

    donation.reviewed = true;
    donation.reviewed_by = user.id;

    await this.donationsRepository.save(donation);

    donation.reviewer = { name: user.name } as User;

    return donation;
  }
}

export default ReviewDonationService;
