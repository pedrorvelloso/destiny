import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import { container } from '@shared/container';

import CreateOptionIncentiveService from '@modules/incentives/services/CreateOptionIncentiveService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import CreateGoalIncentiveService from '@modules/incentives/services/CreateGoalIncentiveService';

@controller('/incentives')
class IncentivesController implements interfaces.Controller {
  @httpPost('/option', ensureAuthenticated)
  public async createOptionIncentive(
    @request() req: Request,
    @response() res: Response,
  ): Promise<Response> {
    const user_id = req.user.id;
    const {
      name,
      description,
      event_id,
      game_id,
      enable_option,
      default_options,
    } = req.body;

    const createOptionIncentive = container.resolve(
      CreateOptionIncentiveService,
    );

    const incentive = await createOptionIncentive.execute({
      name,
      description,
      enable_option,
      event_id,
      game_id,
      user_id,
      default_options,
    });

    return res.json(classToClass(incentive));
  }

  @httpPost('/goal', ensureAuthenticated)
  public async createGoalIncentive(
    @request() req: Request,
    @response() res: Response,
  ): Promise<Response> {
    const user_id = req.user.id;
    const { name, description, event_id, game_id, goal } = req.body;

    const createGoalIncentive = container.resolve(CreateGoalIncentiveService);

    const incentive = await createGoalIncentive.execute({
      name,
      description,
      event_id,
      game_id,
      user_id,
      goal,
    });

    return res.json(classToClass(incentive));
  }
}

export default IncentivesController;
