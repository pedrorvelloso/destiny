import 'dotenv/config';
import 'reflect-metadata';

import connection from '@shared/infra/typeorm';

connection.then(() => {
  // start IoC Container
  require('@shared/container');

  // start http and listeners
  require('@shared/infra/http/server');
  require('@modules/donations/listeners');
});
