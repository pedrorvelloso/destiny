import Donation from '../infra/typeorm/entities/Donation';
import ICreateDonationDTO from '../dtos/ICreateDonationDTO';

export default interface IDonationsRepository {
  create(data: ICreateDonationDTO): Promise<Donation>;
  all(): Promise<Donation[]>;
  total(): Promise<number>;
  findByReviewedStatus(reviewed: boolean): Promise<Donation[]>;
  findById(id: number): Promise<Donation | undefined>;
  save(donation: Donation): Promise<Donation>;
}
