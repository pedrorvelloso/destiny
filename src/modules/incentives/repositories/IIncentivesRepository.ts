import ISearchDTO from '@shared/dtos/ISearchDTO';
import Incentive from '../infra/typeorm/entities/Incentive';
import ICreateIncentiveDTO from '../dtos/ICreateIncentiveDTO';
import IFindByGameIdDTO from '../dtos/IFindByGameIdDTO';

export default interface IIncentivesRepository {
  create(data: ICreateIncentiveDTO): Promise<Incentive>;
  findById(id: number): Promise<Incentive | undefined>;
  findByName(name: string): Promise<Incentive | undefined>;
  findByGameId(data: IFindByGameIdDTO): Promise<Incentive[]>;
  findByEventId(event_id: number): Promise<Incentive[]>;
  search(data: ISearchDTO): Promise<Incentive[]>;
  save(incentive: Incentive): Promise<Incentive>;
}
