import { Router } from 'express';

import donationsRouter from '@modules/donations/infra/http/routes/donations.routes';

const routes = Router();

routes.use('/donations', donationsRouter);
routes.get('/', (req, res) => res.json({ running: true }));

export default routes;
