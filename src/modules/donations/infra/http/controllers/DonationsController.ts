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

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ListAllDonationsService from '@modules/donations/services/ListAllDonationsService';
import ReviewDonationService from '@modules/donations/services/ReviewDonationService';
import ListUnreviewedDonationsService from '@modules/donations/services/ListUnreviewedDonationsService';
import TotalDonationService from '@modules/donations/services/TotalDonationsService';
import AllocateDonationToIncentiveService from '@modules/donations/services/AllocateDonationToIncentiveService';
import ShowDonationService from '@modules/donations/services/ShowDonationService';

import { parameterIdValidation, allocateValidatiom } from '../validations';

@controller('/donations')
class DonationsController implements interfaces.Controller {
  @httpGet('/')
  public async getAllDonations(req: Request, res: Response): Promise<Response> {
    const listAllDonations = container.resolve(ListAllDonationsService);

    const donations = await listAllDonations.execute();

    return res.json(donations);
  }

  @httpGet('/:id')
  public async getDonation(
    @response() res: Response,
    @requestParam('id') id: number,
  ): Promise<Response> {
    const showDonation = container.resolve(ShowDonationService);

    const donation = await showDonation.execute({ id });

    return res.json(donation);
  }

  @httpGet('/unreviewed/event/:id', parameterIdValidation)
  public async listUnreviewedDonations(
    @response() res: Response,
    @requestParam('id') event_id: number,
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
    const { id: user_id } = req.user;

    const reviewDonation = container.resolve(ReviewDonationService);

    const donation = await reviewDonation.execute({
      donation_id: id,
      reviewer_id: user_id,
    });

    req.ws.emit.reviewedDonation(donation);

    return res.json(donation);
  }

  @httpPatch(
    '/:id/allocate',
    ensureAuthenticated,
    parameterIdValidation,
    allocateValidatiom,
  )
  public async allocateDonation(
    @response() res: Response,
    @request() req: Request,
    @requestParam('id') id: number,
  ): Promise<Response> {
    const user_id = req.user.id;
    const { incentive_option_id } = req.body;

    const allocateDonationToIncentive = container.resolve(
      AllocateDonationToIncentiveService,
    );

    const donation = await allocateDonationToIncentive.execute({
      donation_id: id,
      incentive_option_id,
      user_id,
    });

    return res.json(donation);
  }
}

export default DonationsController;
