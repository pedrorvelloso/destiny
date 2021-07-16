import { ContainerModule, interfaces } from 'inversify';
import IIncentivesRepository from '../repositories/IIncentivesRepository';
import IncentivesRepository from '../infra/typeorm/repositories/IncentivesRepository';
import IIncentiveOptionsRepository from '../repositories/IIncentiveOptionsRepository';
import IncentiveOptionsRepository from '../infra/typeorm/repositories/IncentiveOptionsRepository';

const incentivesContainer = new ContainerModule(
  (bind: interfaces.Bind, _: interfaces.Unbind) => {
    bind<IIncentivesRepository>('IncentivesRepository')
      .to(IncentivesRepository)
      .inSingletonScope();
    bind<IIncentiveOptionsRepository>('IncentiveOptionsRepository')
      .to(IncentiveOptionsRepository)
      .inSingletonScope();
  },
);

export default incentivesContainer;
