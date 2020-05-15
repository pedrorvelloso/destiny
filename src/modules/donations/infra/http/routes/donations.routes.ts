import { Router } from 'express';
import DonationsController from '../controllers/DonationsController';

const donationsRouter = Router();
const donationsController = new DonationsController();

donationsRouter.get('/', donationsController.show);

export default donationsRouter;
