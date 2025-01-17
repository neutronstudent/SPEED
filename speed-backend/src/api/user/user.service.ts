import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// This service is used to interact with the database in MongoDB to retrieve user data
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(uid: string): Promise<User> {
    return await this.userModel.findOne({ uid }).exec();
  }

  async create(user: User): Promise<User> {
    return await this.userModel.create(user);
  }
}
