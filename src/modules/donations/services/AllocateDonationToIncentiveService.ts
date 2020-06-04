import { injectable, inject } from 'inversify';
import IIncentiveOptionsRepository from '@modules/incentives/repositories/IIncentiveOptionsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IIncentivesRepository from '@modules/incentives/repositories/IIncentivesRepository';
import ApplicationError from '@shared/errors/ApplicationError';
import Incentive from '@modules/incentives/infra/typeorm/entities/Incentive';
import Donation from '../infra/typeorm/entities/Donation';
import IDonationsRepository from '../repositories/IDonationsRepository';

interface IRequest {
  donation_id: number;
  incentive_option_id: number;
  user_id: string;
}

@injectable()
class AllocateDonationToIncentiveService {
  constructor(
    @inject('IncentiveOptionsRepository')
    private incentiveOptionsRepository: IIncentiveOptionsRepository,
    @inject('DonationsRepository')
    private donationsRepository: IDonationsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('IncentivesRepository')
    private incentivesRepository: IIncentivesRepository,
  ) {}

  public async execute({
    donation_id,
    incentive_option_id,
    user_id,
  }: IRequest): Promise<Donation> {
    const donation = await this.donationsRepository.findById(donation_id);
    if (!donation) throw new ApplicationError('Donation does not exists');

    const checkUserExists = await this.usersRepository.findById(user_id);
    if (!checkUserExists) throw new ApplicationError('User does not exists');

    const incentive_option = await this.incentiveOptionsRepository.findById(
      incentive_option_id,
    );
    if (!incentive_option) throw new ApplicationError('Option does not exists');

    const incentive = (await this.incentivesRepository.findById(
      incentive_option.incentive_id,
    )) as Incentive;

    if (incentive.ended_at)
      throw new ApplicationError('Incentive is already over');

    donation.donation_incentive = incentive_option_id;

    const allocatedIncentive = await this.donationsRepository.save(donation);

    return allocatedIncentive;
  }
}

export default AllocateDonationToIncentiveService;
