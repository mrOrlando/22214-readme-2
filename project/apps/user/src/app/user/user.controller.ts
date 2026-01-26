import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Controller({ path: 'users' })
export class UserController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post('/register')
  public create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  @Get('/')
  public async index(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
