import { injectable } from 'inversify';
import { Repository, getRepository } from 'typeorm';

import IIncentiveOptionsRepository from '@modules/incentives/repositories/IIncentiveOptionsRepository';
import ICreateIncentiveOptionDTO from '@modules/incentives/dtos/ICreateIncentiveOptionDTO';
import IncentiveOption from '../entities/IncentiveOption';

@injectable()
class IncentiveOptionsRepository implements IIncentiveOptionsRepository {
  private ormRepository: Repository<IncentiveOption>;

  constructor() {
    this.ormRepository = getRepository(IncentiveOption);
  }

  public async create(
    createData: ICreateIncentiveOptionDTO,
  ): Promise<IncentiveOption> {
    const incentive = this.ormRepository.create(createData);

    return this.ormRepository.save(incentive);
  }

  public async createBulk(
    bulkData: ICreateIncentiveOptionDTO[],
  ): Promise<IncentiveOption[]> {
    const created = Promise.all(
      bulkData.map(async incentiveData => {
        const incentive = this.ormRepository.create(incentiveData);

        return this.ormRepository.save(incentive);
      }),
    );

    return created;
  }

  public async findById(id: number): Promise<IncentiveOption | undefined> {
    return this.ormRepository.findOne(id);
  }
}

export default IncentiveOptionsRepository;
