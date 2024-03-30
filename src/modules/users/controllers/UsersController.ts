import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';
import ListUsersService from '../services/ListUsersService';
import { instanceToInstance } from 'class-transformer';

class UsersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listUserService = new ListUsersService();

    const users = await listUserService.execute();

    return response.json(instanceToInstance(users));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({ name, email, password });

    return response.json(instanceToInstance(user));
  }
}

export default UsersController;
