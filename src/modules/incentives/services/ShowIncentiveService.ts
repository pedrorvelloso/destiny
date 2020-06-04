import { inject, injectable } from 'inversify';
import ApplicationError from '@shared/errors/ApplicationError';
import Incentive from '../infra/typeorm/entities/Incentive';
import IIncentivesRepository from '../repositories/IIncentivesRepository';

interface IRequest {
  incentive_id: number;
}

@injectable()
class ShowIncentiveService {
  constructor(
    @inject('IncentivesRepository')
    private incentivesRepository: IIncentivesRepository,
  ) {}

  public async execute({ incentive_id }: IRequest): Promise<Incentive> {
    const incentive = await this.incentivesRepository.findById(incentive_id);

    if (!incentive) throw new ApplicationError('Incentive not found', 404);

    incentive.options.sort((a, b) => b.total - a.total);

    return incentive;
  }
}

export default ShowIncentiveService;
