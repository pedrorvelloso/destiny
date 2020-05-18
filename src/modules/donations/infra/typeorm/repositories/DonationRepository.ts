import { injectable } from 'inversify';
import { getRepository, Repository } from 'typeorm';
import IDonationRepository from '@modules/donations/repositories/IDonationRepository';
import ICreateDonationDTO from '@modules/donations/dtos/ICreateDonationDTO';

import Donation from '../entities/Donation';

@injectable()
class DonationRepository implements IDonationRepository {
  private ormRepository: Repository<Donation>;

  constructor() {
    this.ormRepository = getRepository(Donation);
  }

  public async findById(id: number): Promise<Donation | undefined> {
    const donation = await this.ormRepository.findOne(id);

    return donation;
  }

  public async findByReviewedStatus(reviewed: boolean): Promise<Donation[]> {
    const donations = await this.ormRepository.find({
      where: {
        reviewed,
      },
    });

    return donations;
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
      reviewed: false,
    });

    await this.ormRepository.save(donation);

    return donation;
  }

  public async total(): Promise<number> {
    let total = 0;
    const donations = await this.ormRepository.find({
      select: ['amount'],
      where: { reviewed: true },
    });

    donations.forEach(donation => {
      total += donation.amount;
    });

    return total;
  }

  public async all(): Promise<Donation[]> {
    const donations = this.ormRepository.find();

    return donations;
  }

  public async save(donation: Donation): Promise<Donation> {
    return this.ormRepository.save(donation);
  }
}

export default DonationRepository;
