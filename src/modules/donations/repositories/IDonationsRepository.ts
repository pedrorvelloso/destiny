import Donation from '../infra/typeorm/entities/Donation';
import ICreateDonationDTO from '../dtos/ICreateDonationDTO';
import IFindByReviewedStatusDTO from '../dtos/IFindByReviewedStatusDTO';

export default interface IDonationsRepository {
  create(data: ICreateDonationDTO): Promise<Donation>;
  all(): Promise<Donation[]>;
  total(): Promise<number>;
  totalByEventId(event_id: number): Promise<number>;
  findByReviewedStatus(data: IFindByReviewedStatusDTO): Promise<Donation[]>;
  findById(id: number): Promise<Donation | undefined>;
  save(donation: Donation): Promise<Donation>;
}
