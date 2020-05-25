import { injectable } from 'inversify';
import { getRepository, Repository } from 'typeorm';
import IDonationsRepository from '@modules/donations/repositories/IDonationsRepository';

import ICreateDonationDTO from '@modules/donations/dtos/ICreateDonationDTO';
import IFindByReviewedStatusDTO from '@modules/donations/dtos/IFindByReviewedStatusDTO';

import Donation from '../entities/Donation';

@injectable()
class DonationsRepository implements IDonationsRepository {
  private ormRepository: Repository<Donation>;

  constructor() {
    this.ormRepository = getRepository(Donation);
  }

  public async findById(id: number): Promise<Donation | undefined> {
    const donation = await this.ormRepository.findOne(id);

    return donation;
  }

  public async findByReviewedStatus({
    event_id,
    reviewed,
  }: IFindByReviewedStatusDTO): Promise<Donation[]> {
    const donations = await this.ormRepository.find({
      where: {
        event_id,
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
    event_id = null,
  }: ICreateDonationDTO): Promise<Donation> {
    const donation = this.ormRepository.create({
      from,
      amount,
      message,
      source,
      reviewed: false,
      event_id,
    });

    await this.ormRepository.save(donation);

    return donation;
  }

  public async total(): Promise<number> {
    const { total } = await this.ormRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount) as TOTAL')
      .where('donation.reviewed = :reviewed', { reviewed: true })
      .getRawOne();

    return parseInt(total, 10);
  }

  public async all(): Promise<Donation[]> {
    const donations = await this.ormRepository
      .createQueryBuilder('donations')
      .select(['donations', 'user.name'])
      .leftJoin('donations.reviewer', 'user')
      .orderBy('donations.created_at', 'DESC')
      .getMany();

    return donations;
  }

  public async save(donation: Donation): Promise<Donation> {
    return this.ormRepository.save(donation);
  }

  public async totalByEventId(event_id: number): Promise<number> {
    const { total } = await this.ormRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount) as TOTAL')
      .where('donation.reviewed = :reviewed AND event_id = :event_id', {
        reviewed: true,
        event_id,
      })
      .getRawOne();

    return parseInt(total, 10);
  }
}

export default DonationsRepository;
