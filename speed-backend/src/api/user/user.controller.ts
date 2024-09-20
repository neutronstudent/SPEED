import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './create-user.dto';
  import { error } from 'console';
  
  @Controller('api/users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get('/test')
    test() {
      return this.userService.test();
    }
    // Get all users
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
  
    // Get one user via uid
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
  }
  