import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.schema';
import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'users' })
export class UserController {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>
  ) {}

  @Get('/')
  public async index(): Promise<UserModel[]> {
    return this.userModel.find().exec();
  }
}
