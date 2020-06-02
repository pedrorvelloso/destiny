import { injectable } from 'inversify';
import { getRepository, Repository, Like } from 'typeorm';

import ISearchDTO from '@shared/dtos/ISearchDTO';
import IIncentivesRepository from '@modules/incentives/repositories/IIncentivesRepository';
import ICreateIncentiveDTO from '@modules/incentives/dtos/ICreateIncentiveDTO';

import Incentive from '../entities/Incentive';

@injectable()
class IncentivesRepository implements IIncentivesRepository {
  private ormRepository: Repository<Incentive>;

  constructor() {
    this.ormRepository = getRepository(Incentive);
  }

  public async findById(id: number): Promise<Incentive | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByName(name: string): Promise<Incentive | undefined> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async search({ input, limit = 5 }: ISearchDTO): Promise<Incentive[]> {
    const where = input ? { name: Like(`%${input}%`) } : {};
    return this.ormRepository.find({
      where,
      take: limit,
    });
  }

  public async create(createData: ICreateIncentiveDTO): Promise<Incentive> {
    const incentive = this.ormRepository.create(createData);

    return this.ormRepository.save(incentive);
  }

  public async save(incentive: Incentive): Promise<Incentive> {
    return this.ormRepository.save(incentive);
  }
}

export default IncentivesRepository;
