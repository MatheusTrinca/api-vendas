import { Request, Response } from 'express';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createSessionsService = container.resolve(CreateSessionsService);

    const user = await createSessionsService.execute({
      email,
      password,
    });

    return response.json(instanceToInstance(user));
  }
}

export default SessionsController;
