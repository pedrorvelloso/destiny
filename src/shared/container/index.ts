import { ContainerModule, interfaces, Container } from 'inversify';

import { usersContainer } from '@modules/users/providers';
import { gamesContainer } from '@modules/games/providers';
import incentivesContainer from '@modules/incentives/providers';

import DonationsRepository from '@modules/donations/infra/typeorm/repositories/DonationsRepository';
import IDonationsRepository from '@modules/donations/repositories/IDonationsRepository';

import IEventsRepository from '@modules/events/repositories/IEventsRepository';
import EventsRepository from '@modules/events/infra/typeorm/repositories/EventsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import sharedProviders from './providers';

const indexContainer = new ContainerModule(
  (bind: interfaces.Bind, _: interfaces.Unbind) => {
    bind<IDonationsRepository>('DonationsRepository')
      .to(DonationsRepository)
      .inSingletonScope();
    bind<IEventsRepository>('EventsRepository')
      .to(EventsRepository)
      .inSingletonScope();
    bind<IUsersRepository>('UsersRepository')
      .to(UsersRepository)
      .inSingletonScope();
  },
);

const container = new Container();
container.load(
  indexContainer,
  usersContainer,
  gamesContainer,
  incentivesContainer,
  ...sharedProviders,
);

export { container };
