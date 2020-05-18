import { Request, Response } from 'express';
import {
  controller,
  interfaces,
  httpGet,
  httpPatch,
  response as responseHttp,
} from 'inversify-express-utils';

import ListAllDonationsService from '@modules/donations/services/ListAllDonationsService';
import ReviewDonationService from '@modules/donations/services/ReviewDonationService';
import ListUnrevisedDonationsService from '@modules/donations/services/ListUnreviewedDonationsService';
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
  public async getAllDonations(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const listAllDonations = container.resolve(ListAllDonationsService);

    const donations = await listAllDonations.execute();

    return response.json(donations);
  }

  @httpGet('/unreviewed')
  public async listUnrevisedDonations(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const listUnrevisedDonations = container.resolve(
      ListUnrevisedDonationsService,
    );

    const donations = await listUnrevisedDonations.execute();

    return response.json(donations);
  }

  @httpGet('/total')
  public async getTotalDonations(
    @responseHttp() response: Response,
  ): Promise<Response> {
    const totalDonations = container.resolve(TotalDonationService);

    const total = await totalDonations.execute();

    return response.json({ total });
  }

  @httpPatch('/review')
  public async reviewDonation(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { donation_id } = request.body;
    const reviewDonation = container.resolve(ReviewDonationService);

    const donation = await reviewDonation.execute({ donation_id });

    this.total += donation.amount;
    request.ws.emit(EVENTS.TOTAL_DONATIONS, this.total);
    request.ws.emit(EVENTS.NEW_REVIEWED_DONATION, donation);

    return response.json(donation);
  }
}

export default DonationsController;
