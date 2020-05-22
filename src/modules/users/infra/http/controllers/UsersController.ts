import {
  controller,
  interfaces,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import { container } from '@shared/container';

import CreateUserService from '@modules/users/services/CreateUserService';

import { createUserValidation } from '../validations';

@controller('/users')
class UsersController implements interfaces.Controller {
  @httpPost('/', createUserValidation)
  public async createUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    return res.json({ user: classToClass(user) });
  }
}

export default UsersController;
