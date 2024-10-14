import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { error } from 'console';
import { User } from './user.schema';

// This controller is used to define the user controller in the application for the api calls from the frontend
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Gets and retrieves all user data
  @Get('/')
  async findAll() {
    try {
      return this.userService.findAll();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Users found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  // Gets one user via uid and retrieves data
  @Get('/:uid')
  async findOne(@Param('uid') uid: string) {
    try {
      return this.userService.findOne(uid);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No User found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Post('/:uid')
  async createUser(@Param('uid') uid: string) {
    try {
      const user: User = {
        uid: uid,
        role: 'Submitter',
      };
      return this.userService.create(user);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Could not create user',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
