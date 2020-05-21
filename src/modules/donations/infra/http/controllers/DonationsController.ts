import { Request, Response } from 'express';
import {
  controller,
  interfaces,
  httpGet,
  httpPatch,
  response,
  request,
  requestParam,
} from 'inversify-express-utils';

import { container } from '@shared/container';
import { EVENTS } from '@shared/infra/ws/events';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ListAllDonationsService from '@modules/donations/services/ListAllDonationsService';
import ReviewDonationService from '@modules/donations/services/ReviewDonationService';
import ListUnreviewedDonationsService from '@modules/donations/services/ListUnreviewedDonationsService';
import TotalDonationService from '@modules/donations/services/TotalDonationsService';

import { parameterIdValidation } from '../validations';

@controller('/donations')
class DonationsController implements interfaces.Controller {
  @httpGet('/')
  public async getAllDonations(req: Request, res: Response): Promise<Response> {
    const listAllDonations = container.resolve(ListAllDonationsService);

    const donations = await listAllDonations.execute();

    return res.json(donations);
  }

  @httpGet('/unreviewed/event/:event_id', parameterIdValidation)
  public async listUnreviewedDonations(
    @response() res: Response,
    @requestParam('event_id') event_id: number,
  ): Promise<Response> {
    const listUnreviewedDonations = container.resolve(
      ListUnreviewedDonationsService,
    );

    const donations = await listUnreviewedDonations.execute({ event_id });

    return res.json(donations);
  }

  @httpGet('/total')
  public async getTotalDonations(@response() res: Response): Promise<Response> {
    const totalDonations = container.resolve(TotalDonationService);

    const total = await totalDonations.execute();

    return res.json({ total });
  }

  @httpPatch('/:id/review', ensureAuthenticated, parameterIdValidation)
  public async reviewDonation(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: number,
  ): Promise<Response> {
    const reviewDonation = container.resolve(ReviewDonationService);

    const donation = await reviewDonation.execute({ donation_id: id });

    req.ws.emit(
      `${EVENTS.NEW_REVIEWED_DONATION}:${donation.event_id}`,
      donation,
    );

    return res.json(donation);
  }
}

export default DonationsController;
