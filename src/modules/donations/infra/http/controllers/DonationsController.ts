import { Request, Response } from 'express';
import {
  controller,
  interfaces,
  httpGet,
  httpPatch,
  response,
  requestParam,
} from 'inversify-express-utils';

import ListAllDonationsService from '@modules/donations/services/ListAllDonationsService';
import ReviewDonationService from '@modules/donations/services/ReviewDonationService';
import ListUnreviewedDonationsService from '@modules/donations/services/ListUnreviewedDonationsService';
import { container } from '@shared/container';
import { EVENTS } from '@shared/infra/ws/events';
import TotalDonationService from '@modules/donations/services/TotalDonationsService';

@controller('/donations')
class DonationsController implements interfaces.Controller {
  /**
   * @TODO store total in DB
   */
  private total = 0;

  @httpGet('/')
  public async getAllDonations(req: Request, res: Response): Promise<Response> {
    const listAllDonations = container.resolve(ListAllDonationsService);

    const donations = await listAllDonations.execute();

    return res.json(donations);
  }

  @httpGet('/unreviewed/event/:event_id')
  public async listUnreviewedDonations(
    @response() res: Response,
    @requestParam('event_id') event_id: string,
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

  @httpPatch('/review')
  public async reviewDonation(req: Request, res: Response): Promise<Response> {
    const { donation_id } = req.body;
    const reviewDonation = container.resolve(ReviewDonationService);

    const donation = await reviewDonation.execute({ donation_id });

    this.total += donation.amount;
    req.ws.emit(EVENTS.TOTAL_DONATIONS, this.total);
    req.ws.emit(EVENTS.NEW_REVIEWED_DONATION, donation);

    return res.json(donation);
  }
}

export default DonationsController;
