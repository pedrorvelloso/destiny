import { injectable } from 'inversify';
import { getMongoRepository, MongoRepository } from 'typeorm';
import IDonationRepository from '@modules/donations/repositories/IDonationRepository';
import ICreateDonationDTO from '@modules/donations/dtos/ICreateDonationDTO';

import Donation from '../typeorm/entities/Donation';

@injectable()
class DonationRepository implements IDonationRepository {
  private ormRepository: MongoRepository<Donation>;

  constructor() {
    this.ormRepository = getMongoRepository(Donation);
  }

  public async findById(_id: string): Promise<Donation | undefined> {
    const donation = await this.ormRepository.findOne(_id);

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

  public async all(): Promise<Donation[]> {
    const donations = this.ormRepository.find();

    return donations;
  }

  public async save(donation: Donation): Promise<Donation> {
    return this.ormRepository.save(donation);
  }
}

export default DonationRepository;
