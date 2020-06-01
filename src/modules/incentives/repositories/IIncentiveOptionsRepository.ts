import IncentiveOption from '../infra/typeorm/entities/IncentiveOption';
import ICreateIncentiveOptionDTO from '../dtos/ICreateIncentiveOptionDTO';

export default interface IIncentiveOptionsRepository {
  create(data: ICreateIncentiveOptionDTO): Promise<IncentiveOption>;
  createBulk(data: ICreateIncentiveOptionDTO[]): Promise<IncentiveOption[]>;
}
