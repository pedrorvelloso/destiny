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
import ShowIncentiveByGameIdService from '@modules/incentives/services/ShowIncentivesByGameIdService';

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

  @httpGet('/game/:id')
  public async getIncentivesByGame(
    @response() res: Response,
    @requestParam('id') gameId: number,
  ): Promise<Response> {
    const showIncentiveByGameId = container.resolve(
      ShowIncentiveByGameIdService,
    );

    const incentives = await showIncentiveByGameId.execute({ game_id: gameId });

    return res.json(classToClass(incentives));
  }
}

export default IncentivesController;
