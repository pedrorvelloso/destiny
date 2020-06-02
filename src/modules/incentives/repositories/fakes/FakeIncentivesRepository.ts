import ISearchDTO from '@shared/dtos/ISearchDTO';
import Incentive from '@modules/incentives/infra/typeorm/entities/Incentive';
import ICreateIncentiveDTO from '@modules/incentives/dtos/ICreateIncentiveDTO';
import IIncentivesRepository from '../IIncentivesRepository';

class FakeIncentivesRepository implements IIncentivesRepository {
  private incentives: Incentive[] = [];

  public async findById(id: number): Promise<Incentive | undefined> {
    return this.incentives.find(incentive => incentive.id === id);
  }

  public async findByName(name: string): Promise<Incentive | undefined> {
    return this.incentives.find(incentive => incentive.name === name);
  }

  public async search({ input, limit }: ISearchDTO): Promise<Incentive[]> {
    const findIncentives = (input
      ? this.incentives.filter(game => game.name.includes(input))
      : [...this.incentives]
    ).splice(0, limit || 5);

    return findIncentives;
  }

  public async create(incentiveData: ICreateIncentiveDTO): Promise<Incentive> {
    const incentive = new Incentive();

    Object.assign(incentive, { id: this.incentives.length + 1 }, incentiveData);

    this.incentives.push(incentive);

    return incentive;
  }

  public async save(incentive: Incentive): Promise<Incentive> {
    const findIndex = this.incentives.findIndex(i => i.id === incentive.id);

    this.incentives[findIndex] = incentive;

    return incentive;
  }
}

export default FakeIncentivesRepository;
