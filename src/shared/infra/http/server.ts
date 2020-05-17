import express, { Response } from 'express';
import http from 'http';
import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from '@shared/container';

import './routes';

import HttpError from '@shared/errors/HttpError';
import { createWebsocket } from '../ws';

const expressServer = express();

const httpServer = http.createServer(expressServer);
export const websocket = createWebsocket(httpServer);

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

inversifyServer.setErrorConfig(application => {
  application.use(
    (
      error: Error,
      request: express.Request,
      response: express.Response,
      _: express.NextFunction,
    ): Response => {
      if (error instanceof HttpError) {
        return response.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      console.error(error.stack);
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    },
  );
});

inversifyServer.build();

httpServer.listen(3333, () => {
  console.log('🚀 Listening on port 3333');
});