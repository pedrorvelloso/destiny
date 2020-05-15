import { createConnection } from 'typeorm';
import path from 'path';

export default createConnection({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  username: 'root',
  password: 'example',
  database: 'destiny',
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
