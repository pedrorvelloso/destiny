import { Container } from 'inversify';

import IHashProvider from './HashProvider/models/IHashProvider';
import BcryptHashProvider from './HashProvider/implementations/BcryptHashProvider';

const usersContainer = new Container({ defaultScope: 'Singleton' });

usersContainer.bind<IHashProvider>('HashProvider').to(BcryptHashProvider);

export { usersContainer };
