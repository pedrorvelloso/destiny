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

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

@controller('/auth')
class AuthController implements interfaces.Controller {
  @httpPost('/')
  public async createUser(
    @request() req: Request,
    @response() res: Response,
  ): Promise<Response> {
    const { email, password } = req.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    return res.json({ user: classToClass(user), token });
  }
}

export default AuthController;
