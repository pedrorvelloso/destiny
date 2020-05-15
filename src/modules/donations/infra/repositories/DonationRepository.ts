import { Repository, getRepository } from 'typeorm';
import IDonationRepository from '@modules/donations/repositories/IDonationRepository';
import ICreateDonationDTO from '@modules/donations/dtos/ICreateDonationDTO';

import Donation from '../typeorm/entities/Donation';

class DonationRepository implements IDonationRepository {
  private ormRepository: Repository<Donation>;

  constructor() {
    this.ormRepository = getRepository(Donation);
  }

  public async create({
    from,
    amount,
    message,
    source,
  }: ICreateDonationDTO): Promise<Donation> {
    const donation = this.ormRepository.create({
      from,
      amount,
      message,
      source,
    });

    await this.ormRepository.save(donation);

    return donation;
  }
}

export default DonationRepository;
