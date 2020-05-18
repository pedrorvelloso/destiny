import { uuid } from 'uuidv4';

import Donation from '@modules/donations/infra/typeorm/entities/Donation';
import ICreateDonationDTO from '@modules/donations/dtos/ICreateDonationDTO';
import IDonationRepository from '../IDonationRepository';

class FakeDonationRepository implements IDonationRepository {
  private donations: Donation[] = [];

  public async create(donationData: ICreateDonationDTO): Promise<Donation> {
    const donation = new Donation();

    Object.assign(donation, { id: uuid(), reviewed: false }, donationData);

    this.donations.push(donation);

    return donation;
  }

  public async all(): Promise<Donation[]> {
    return this.donations;
  }

  public async findById(id: number): Promise<Donation | undefined> {
    const findDonation = this.donations.find(d => d.id === id);

    return findDonation;
  }

  public async findByReviewedStatus(status: boolean): Promise<Donation[]> {
    return this.donations.filter(donation => donation.reviewed === status);
  }

  public async save(donation: Donation): Promise<Donation> {
    const findIndex = this.donations.findIndex(d => d.id === donation.id);

    this.donations[findIndex] = donation;

    return donation;
  }
}

export default FakeDonationRepository;
