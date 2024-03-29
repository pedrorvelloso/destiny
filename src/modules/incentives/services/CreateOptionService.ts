import { injectable, inject } from 'inversify';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ApplicationError from '@shared/errors/ApplicationError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { INCENTIVES_LIST } from '@shared/container/providers/CacheProvider/utils/prefixes';
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
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    incentive_id,
    created_by,
  }: IRequest): Promise<IncentiveOption> {
    const incentive = await this.incentivesRepository.findById(incentive_id);
    const checkUserExists = await this.usersRepository.findById(created_by);

    if (!checkUserExists || !incentive)
      throw new ApplicationError('Failed to create Incentive');

    if (incentive.type === IIncentiveType.GOAL)
      throw new ApplicationError('Cannot create option for Goal Incentive');

    if (!incentive.enable_option)
      throw new ApplicationError('Incentive has disabled options');

    const option = await this.incentiveOptionsRepository.create({
      name,
      incentive_id,
      created_by,
    });

    await this.cacheProvider.invalidate(
      `${INCENTIVES_LIST}:${incentive.event_id}`,
    );

    return option;
  }
}

export default CreateOptionService;
