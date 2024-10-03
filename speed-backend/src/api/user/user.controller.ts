import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { error } from 'console';

// This controller is used to define the user controller in the application for the api calls from the frontend
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  test() {
    return this.userService.test();
  }

  // Gets and retrieves all user data
  // @Get('/')
  // async findAll() {
  //   try {
  //     return this.userService.findAll();
  //   } catch {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         error: 'No Users found',
  //       },
  //       HttpStatus.NOT_FOUND,
  //       { cause: error },
  //     );
  //   }
  // }

  // // Gets one user via uid and retrieves data
  // @Get('/:uid')
  // async findOne(@Param('uid') uid: string) {
  //   try {
  //     return this.userService.findOne(uid);
  //   } catch {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.NOT_FOUND,
  //         error: 'No User found',
  //       },
  //       HttpStatus.NOT_FOUND,
  //       { cause: error },
  //     );
  //   }
  // }
}
