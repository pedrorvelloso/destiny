import { ContainerModule, interfaces } from 'inversify';
import DonationsRepository from '../infra/typeorm/repositories/DonationsRepository';
import IDonationsRepository from '../repositories/IDonationsRepository';

const donationsContainer = new ContainerModule(
  (bind: interfaces.Bind, _: interfaces.Unbind) => {
    bind<IDonationsRepository>('DonationsRepository')
      .to(DonationsRepository)
      .inSingletonScope();
  },
);

export default donationsContainer;
