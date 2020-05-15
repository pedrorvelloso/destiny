import { container } from 'tsyringe';

import DonationRepository from '@modules/donations/infra/repositories/DonationRepository';
import IDonationRepository from '@modules/donations/repositories/IDonationRepository';

container.registerSingleton<IDonationRepository>(
  'DonationRepository',
  DonationRepository,
);
