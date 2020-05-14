import Donation from '../infra/typeorm/entities/Donation';
import ICreateDonationDTO from '../dtos/ICreateDonationDTO';

export default interface IDonationRepository {
  create(data: ICreateDonationDTO): Promise<Donation>;
}
