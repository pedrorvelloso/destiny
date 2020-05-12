import express from 'express';
import routes from './routes';

import '@modules/donations/listeners';

const app = express();

app.use(routes);

app.listen(3333, () => {
  console.log('🚀 Listening on port 3333');
});
