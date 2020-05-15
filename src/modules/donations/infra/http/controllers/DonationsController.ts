import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListAllDonationsService from '@modules/donations/services/ListAllDonationsService';

class DonationsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const listAllDonations = container.resolve(ListAllDonationsService);

    const donations = await listAllDonations.execute();

    return response.json(donations);
  }
}

export default DonationsController;
