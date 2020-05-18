import Donation from '../infra/typeorm/entities/Donation';
import ICreateDonationDTO from '../dtos/ICreateDonationDTO';

export default interface IDonationRepository {
  create(data: ICreateDonationDTO): Promise<Donation>;
  all(): Promise<Donation[]>;
  findByReviewedStatus(reviewed: boolean): Promise<Donation[]>;
  findById(id: number): Promise<Donation | undefined>;
  save(donation: Donation): Promise<Donation>;
}
