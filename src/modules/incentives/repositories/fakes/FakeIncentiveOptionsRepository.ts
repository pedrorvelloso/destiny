import IncentiveOption from '@modules/incentives/infra/typeorm/entities/IncentiveOption';
import ICreateIncentiveOptionDTO from '@modules/incentives/dtos/ICreateIncentiveOptionDTO';
import IIncentiveOptionsRepository from '../IIncentiveOptionsRepository';

class FakeIncentiveOptionsRepository implements IIncentiveOptionsRepository {
  private incentive_options: IncentiveOption[] = [];

  public async findById(id: number): Promise<IncentiveOption | undefined> {
    return this.incentive_options.find(
      incentiveOption => incentiveOption.id === id,
    );
  }

  public async create(
    incentiveOptionData: ICreateIncentiveOptionDTO,
  ): Promise<IncentiveOption> {
    const incentiveOption = new IncentiveOption();

    Object.assign(
      incentiveOption,
      { id: this.incentive_options.length + 1 },
      incentiveOptionData,
    );

    this.incentive_options.push(incentiveOption);

    return incentiveOption;
  }

  public async createBulk(
    bulkData: ICreateIncentiveOptionDTO[],
  ): Promise<IncentiveOption[]> {
    const bulkIncentives: IncentiveOption[] = [];

    bulkData.forEach(incentive => {
      const incentiveOption = new IncentiveOption();

      Object.assign(
        incentiveOption,
        { id: this.incentive_options.length + 1 },
        incentive,
      );

      this.incentive_options.push(incentiveOption);
      bulkIncentives.push(incentiveOption);
    });

    return bulkIncentives;
  }
}

export default FakeIncentiveOptionsRepository;
