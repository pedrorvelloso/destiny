import ISearchDTO from '@shared/dtos/ISearchDTO';
import Incentive from '../infra/typeorm/entities/Incentive';
import ICreateIncentiveDTO from '../dtos/ICreateIncentiveDTO';

export default interface IIncentivesRepository {
  create(data: ICreateIncentiveDTO): Promise<Incentive>;
  findById(id: number): Promise<Incentive | undefined>;
  findByName(name: string): Promise<Incentive | undefined>;
  findByEventId(event_id: number): Promise<Incentive[]>;
  search(data: ISearchDTO): Promise<Incentive[]>;
  save(incentive: Incentive): Promise<Incentive>;
}
