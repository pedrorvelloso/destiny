import express from 'express';
import http from 'http';
import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from '@shared/container';

import './routes';

import { createWebsocket } from '../ws';

const expressServer = express();

const httpServer = http.createServer(expressServer);
const websocket = createWebsocket(httpServer);

const inversifyServer = new InversifyExpressServer(
  container,
  null,
  null,
  expressServer,
);

inversifyServer.setConfig(application => {
  application.use(express.json());
  application.use((req, _, next) => {
    req.ws = websocket;
    return next();
  });
});

inversifyServer.build();

httpServer.listen(3333, () => {
  console.log('🚀 Listening on port 3333');
});
