import express, { Response } from 'express';
import http from 'http';
import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';

import { errors } from 'celebrate';

import { container } from '@shared/container';

import './routes';

import ApplicationError from '@shared/errors/ApplicationError';
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
  application.use(cors());
  application.use(express.json());
  application.use((req, _, next) => {
    req.ws = websocket;
    return next();
  });
});

inversifyServer.setErrorConfig(application => {
  application.use(errors());
  application.use(
    (
      error: Error,
      request: express.Request,
      response: express.Response,
      _: express.NextFunction,
    ): Response => {
      if (error instanceof ApplicationError) {
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

const applicationPort = process.env.PORT || 3333;

httpServer.listen(applicationPort, () => {
  console.log(`🚀 Listening on port ${applicationPort}`);
});
