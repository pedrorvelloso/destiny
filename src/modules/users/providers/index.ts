import { ContainerModule, interfaces } from 'inversify';

import IHashProvider from './HashProvider/models/IHashProvider';
import BcryptHashProvider from './HashProvider/implementations/BcryptHashProvider';

import IUsersRepository from '../repositories/IUsersRepository';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

const usersContainer = new ContainerModule(
  (bind: interfaces.Bind, _: interfaces.Unbind) => {
    bind<IUsersRepository>('UsersRepository')
      .to(UsersRepository)
      .inSingletonScope();
    bind<IHashProvider>('HashProvider')
      .to(BcryptHashProvider)
      .inSingletonScope();
  },
);

export default usersContainer;
