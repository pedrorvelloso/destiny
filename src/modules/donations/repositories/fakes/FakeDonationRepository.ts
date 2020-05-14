import { uuid } from 'uuidv4';

import Donation from '@modules/donations/infra/typeorm/entities/Donation';
import ICreateDonationDTO from '@modules/donations/dtos/ICreateDonationDTO';
import IDonationRepository from '../IDonationRepository';

class FakeDonationRepository implements IDonationRepository {
  private donations: Donation[] = [];

  public async create(donationData: ICreateDonationDTO): Promise<Donation> {
    const donation = new Donation();

    Object.assign(donation, { id: uuid() }, donationData);

    this.donations.push(donation);

    return donation;
  }
}

export default FakeDonationRepository;
