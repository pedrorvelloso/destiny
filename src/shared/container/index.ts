import { Container } from 'inversify';

import DonationsRepository from '@modules/donations/infra/typeorm/repositories/DonationsRepository';
import IDonationsRepository from '@modules/donations/repositories/IDonationsRepository';

import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import EventsRepository from '@modules/events/infra/typeorm/repositories/EventsRepository';

const container = new Container({ defaultScope: 'Singleton' });

container
  .bind<IDonationsRepository>('DonationsRepository')
  .to(DonationsRepository);

container.bind<IEventsRepository>('EventsRepository').to(EventsRepository);

export { container };
