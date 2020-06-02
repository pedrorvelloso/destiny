import { injectable, inject } from 'inversify';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ApplicationError from '@shared/errors/ApplicationError';
import IncentiveOption from '../infra/typeorm/entities/IncentiveOption';
import IIncentiveOptionsRepository from '../repositories/IIncentiveOptionsRepository';
import IIncentivesRepository from '../repositories/IIncentivesRepository';
import { IIncentiveType } from '../infra/typeorm/entities/Incentive';

interface IRequest {
  name: string;
  incentive_id: number;
  created_by: string;
}

@injectable()
class CreateOptionService {
  constructor(
    @inject('IncentiveOptionsRepository')
    private incentiveOptionsRepository: IIncentiveOptionsRepository,
    @inject('IncentivesRepository')
    private incentivesRepository: IIncentivesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    incentive_id,
    created_by,
  }: IRequest): Promise<IncentiveOption> {
    const checkIncentiveExists = await this.incentivesRepository.findById(
      incentive_id,
    );
    const checkUserExists = await this.usersRepository.findById(created_by);

    if (!checkUserExists || !checkIncentiveExists)
      throw new ApplicationError('Failed to create Incentive');

    if (checkIncentiveExists.type === IIncentiveType.GOAL)
      throw new ApplicationError('Cannot create option for Goal Incentive');

    if (!checkIncentiveExists.enable_option)
      throw new ApplicationError('Incentive has disabled options');

    const option = await this.incentiveOptionsRepository.create({
      name,
      incentive_id,
      created_by,
    });

    return option;
  }
}

export default CreateOptionService;
