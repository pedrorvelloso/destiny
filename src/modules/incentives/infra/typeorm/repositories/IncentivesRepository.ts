import { injectable } from 'inversify';
import { getRepository, Repository, Like } from 'typeorm';

import ISearchDTO from '@shared/dtos/ISearchDTO';
import IIncentivesRepository from '@modules/incentives/repositories/IIncentivesRepository';
import ICreateIncentiveDTO from '@modules/incentives/dtos/ICreateIncentiveDTO';
import IFindByGameIdDTO from '@modules/incentives/dtos/IFindByGameIdDTO';

import Incentive from '../entities/Incentive';

@injectable()
class IncentivesRepository implements IIncentivesRepository {
  private ormRepository: Repository<Incentive>;

  constructor() {
    this.ormRepository = getRepository(Incentive);
  }

  public async findById(id: number): Promise<Incentive | undefined> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['options'],
    });
  }

  public async findByEventId(event_id: number): Promise<Incentive[]> {
    return this.ormRepository.find({
      where: { event_id },
      relations: ['options'],
    });
  }

  public async findByGameId({
    game_id,
    event_id,
  }: IFindByGameIdDTO): Promise<Incentive[]> {
    return this.ormRepository.find({
      where: { event_id, game_id },
      relations: ['options'],
    });
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

  public async displayById(id: number): Promise<Incentive | undefined> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['options'],
    });
  }
}

export default IncentivesRepository;
