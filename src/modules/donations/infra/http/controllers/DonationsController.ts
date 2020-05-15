import { Request, Response } from 'express';
import { controller, interfaces, httpGet } from 'inversify-express-utils';

import ListAllDonationsService from '@modules/donations/services/ListAllDonationsService';
import { container } from '@shared/container';

@controller('/donations')
class DonationsController implements interfaces.Controller {
  @httpGet('/')
  public async index(request: Request, response: Response): Promise<Response> {
    const listAllDonations = container.resolve(ListAllDonationsService);

    const donations = await listAllDonations.execute();

    return response.json(donations);
  }
}

export default DonationsController;
