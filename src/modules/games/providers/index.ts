import { ContainerModule, interfaces } from 'inversify';
import IGamesRepository from '../repositories/IGamesRepository';
import GamesRepository from '../infra/typeorm/repositories/GamesRepository';

const gamesContainer = new ContainerModule(
  (bind: interfaces.Bind, _: interfaces.Unbind) => {
    bind<IGamesRepository>('GamesRepository')
      .to(GamesRepository)
      .inSingletonScope();
  },
);

export { gamesContainer };
