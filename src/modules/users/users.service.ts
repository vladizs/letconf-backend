import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './users.schema';
import { RegisterPayload } from 'src/modules/auth/payload/register.payload';
import * as crypto from 'crypto';
import { AppRoles } from '../app/app.roles';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('users') private readonly userModel: Model<UserDocument>,
    private readonly profileService: ProfileService,
  ) {}

  get(id: string) {
    return this.userModel.findById(id).exec();
  }

  getByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  async getByUsernamePass(username: string, password: string) {
    return this.userModel
      .findOne({
        username,
        password: crypto.createHmac('sha256', password).digest('hex'),
      })
      .exec();
  }

  async create(payload: RegisterPayload) {
    const user = await this.getByUsername(payload.username);
    if (user) {
      throw new UnprocessableEntityException(
        'Account with this username already exists. Please choose another one',
      );
    }
    const createdUser = new this.userModel({
      ...payload,
      password: crypto.createHmac('sha256', payload.password).digest('hex'),
      roles: AppRoles.DEFAULT,
    });

    const userData = await createdUser.save();

    await this.profileService.createUserProfile(userData.id);

    return userData;
  }

  async delete(username: string) {
    const user = await this.userModel.deleteOne({ username });

    if (user.deletedCount) {
      return { message: `${username} successfully deleted.` };
    } else {
      throw new BadRequestException(`Failed to delete ${username}`);
    }
  }
}
