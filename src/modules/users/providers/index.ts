import { ContainerModule, interfaces } from 'inversify';

import IHashProvider from './HashProvider/models/IHashProvider';
import BcryptHashProvider from './HashProvider/implementations/BcryptHashProvider';

const usersContainer = new ContainerModule(
  (bind: interfaces.Bind, _: interfaces.Unbind) => {
    bind<IHashProvider>('HashProvider')
      .to(BcryptHashProvider)
      .inSingletonScope();
  },
);

export { usersContainer };
