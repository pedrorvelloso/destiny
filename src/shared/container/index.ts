import { Container } from 'inversify';

import usersContainer from '@modules/users/providers';
import gamesContainer from '@modules/games/providers';
import donationsContainer from '@modules/donations/providers';
import incentivesContainer from '@modules/incentives/providers';
import eventsContainer from '@modules/events/providers';

import sharedProviders from './providers';

const container = new Container();
container.load(
  donationsContainer,
  eventsContainer,
  usersContainer,
  gamesContainer,
  incentivesContainer,
  ...sharedProviders,
);

export { container };
