import 'dotenv/config';
import 'reflect-metadata';

import { httpServer } from '@shared/infra/http/server';
import connection from '@shared/infra/typeorm';
import startListeners from '@modules/donations/listeners';

const applicationPort = process.env.PORT || 3333;

const startServer = async () => {
  await connection();
  httpServer.listen(applicationPort, () => {
    console.log(`🚀 Listening on port ${applicationPort}`);
  });
  startListeners();
};

startServer();
