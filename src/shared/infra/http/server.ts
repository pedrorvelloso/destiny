import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from '@shared/container';

import './routes';

import { createWebsocket } from '../ws';

const inversifyServer = new InversifyExpressServer(container);
const websocket = createWebsocket(inversifyServer);

inversifyServer.setConfig(application => {
  application.use((req, _, next) => {
    req.ws = websocket;
    return next();
  });
});

const app = inversifyServer.build();

app.listen(3333, () => {
  console.log('🚀 Listening on port 3333');
});
