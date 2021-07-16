import IncentiveOption from '../infra/typeorm/entities/IncentiveOption';
import ICreateIncentiveOptionDTO from '../dtos/ICreateIncentiveOptionDTO';

export default interface IIncentiveOptionsRepository {
  findById(id: number): Promise<IncentiveOption | undefined>;
  create(data: ICreateIncentiveOptionDTO): Promise<IncentiveOption>;
  createBulk(data: ICreateIncentiveOptionDTO[]): Promise<IncentiveOption[]>;
  save(option: IncentiveOption): Promise<IncentiveOption>;
}
