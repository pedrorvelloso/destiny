/* eslint-disable global-require */
import 'reflect-metadata';

import connection from '@shared/infra/typeorm';

connection.then(() => {
  // start IoC Container
  require('@shared/container');

  // start environment variables
  require('@shared/infra/environment');

  // start http and listeners
  require('@shared/infra/http/server');
  require('@modules/donations/listeners');
});
