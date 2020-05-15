import express from 'express';
import server from 'http';

import routes from './routes';

import { createWebsocket } from '../ws';

const app = express();
const http = server.createServer(app);
const websocket = createWebsocket(http);

app.use((req, _, next) => {
  req.ws = websocket;
  return next();
});

app.use(routes);

http.listen(3333, () => {
  console.log('🚀 Listening on port 3333');
});
