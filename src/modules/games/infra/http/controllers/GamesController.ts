import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  httpGet,
  queryParam,
} from 'inversify-express-utils';
import { container } from '@shared/container';
import { Response, Request } from 'express';

import CreateGameService from '@modules/games/services/CreateGameService';
import SearchGameService from '@modules/games/services/SearchGameService';

@controller('/games')
class GamesController implements interfaces.Controller {
  @httpPost('/')
  public async createGame(
    @request() req: Request,
    @response() res: Response,
  ): Promise<Response> {
    const { name } = req.body;
    const createGame = container.resolve(CreateGameService);

    const game = await createGame.execute({ name });

    return res.json(game);
  }

  @httpGet('/search')
  public async searchGame(
    @response() res: Response,
    @queryParam('input') input?: string,
    @queryParam('limit') limit?: number,
  ): Promise<Response> {
    const searchGame = container.resolve(SearchGameService);

    const games = await searchGame.execute({ search: input, limit });

    return res.json(games);
  }
}

export default GamesController;
