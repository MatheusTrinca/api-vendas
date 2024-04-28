import { Request, Response } from 'express';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    if (!request.file) {
      throw new AppError('File not found');
    }

    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    return response.json(instanceToInstance(user));
  }
}

export default UserAvatarController;
