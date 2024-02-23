import { Request, Response } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import User from '../typeorm/entities/User';
import AppError from '@shared/errors/AppError';

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<User> {
    const updateUserAvatarService = new UpdateUserAvatarService();

    if (!request.file) {
      throw new AppError('File not found');
    }

    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    return user;
  }
}

export default UserAvatarController;
