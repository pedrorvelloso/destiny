import { ContainerModule, interfaces } from 'inversify';

import ICacheProvider from './models/ICacheProvider';
import RedisCacheProvider from './implementations/RedisCacheProvider';

const cacheContainer = new ContainerModule(
  (bind: interfaces.Bind, _: interfaces.Unbind) => {
    bind<ICacheProvider>('CacheProvider')
      .to(RedisCacheProvider)
      .inSingletonScope();
  },
);

export { cacheContainer };
