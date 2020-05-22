import { Container } from 'inversify';

import { usersContainer } from '@modules/users/providers';

import DonationsRepository from '@modules/donations/infra/typeorm/repositories/DonationsRepository';
import IDonationsRepository from '@modules/donations/repositories/IDonationsRepository';

import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import EventsRepository from '@modules/events/infra/typeorm/repositories/EventsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const indexContainer = new Container({ defaultScope: 'Singleton' });

indexContainer
  .bind<IDonationsRepository>('DonationsRepository')
  .to(DonationsRepository);

indexContainer.bind<IEventsRepository>('EventsRepository').to(EventsRepository);

indexContainer.bind<IUsersRepository>('UsersRepository').to(UsersRepository);

const container = Container.merge(indexContainer, usersContainer);

export { container };
