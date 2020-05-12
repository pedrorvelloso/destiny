import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => res.json({ running: true }));

export default routes;
