import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  requestParam,
  httpGet,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import { container } from '@shared/container';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import CreateOptionIncentiveService from '@modules/incentives/services/CreateOptionIncentiveService';
import CreateGoalIncentiveService from '@modules/incentives/services/CreateGoalIncentiveService';
import CreateOptionService from '@modules/incentives/services/CreateOptionService';
import ShowIncentiveService from '@modules/incentives/services/ShowIncentiveService';
import {
  parameterIdValidation,
  createOptionIncentiveValidation,
  createGoalIncentiveValidation,
  createOptionValidation,
} from '../validations';

@controller('/incentives')
class IncentivesController implements interfaces.Controller {
  @httpPost('/option', ensureAuthenticated, createOptionIncentiveValidation)
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

  @httpPost('/goal', ensureAuthenticated, createGoalIncentiveValidation)
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

  @httpGet('/:id', parameterIdValidation)
  public async getIncentive(
    @response() res: Response,
    @requestParam('id') id: number,
  ): Promise<Response> {
    const showIncentive = container.resolve(ShowIncentiveService);

    const incentive = await showIncentive.execute({ incentive_id: id });

    return res.json(classToClass(incentive));
  }

  @httpPost(
    '/:id/options',
    ensureAuthenticated,
    parameterIdValidation,
    createOptionValidation,
  )
  public async createOption(
    @response() res: Response,
    @request() req: Request,
    @requestParam('id') id: number,
  ): Promise<Response> {
    const { name } = req.body;
    const user_id = req.user.id;
    const createOption = container.resolve(CreateOptionService);

    const option = await createOption.execute({
      name,
      created_by: user_id,
      incentive_id: id,
    });

    return res.json(classToClass(option));
  }
}

export default IncentivesController;
