import { createConnection } from 'typeorm';
import path from 'path';

import mongoConfig from '@config/mongo';

export default createConnection({
  type: 'mongodb',
  host: mongoConfig.host,
  port: mongoConfig.port as number,
  username: mongoConfig.username,
  password: mongoConfig.password,
  database: mongoConfig.database,
  authSource: 'admin',
  useUnifiedTopology: true,
  entities: [
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'modules',
      '**',
      'infra',
      'typeorm',
      'entities',
      '*.{js,ts}',
    ),
  ],
});
