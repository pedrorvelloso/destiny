import { Container } from 'inversify';

import DonationRepository from '@modules/donations/infra/repositories/DonationRepository';
import IDonationRepository from '@modules/donations/repositories/IDonationRepository';

const container = new Container({ defaultScope: 'Singleton' });

container
  .bind<IDonationRepository>('DonationRepository')
  .to(DonationRepository);

export { container };
