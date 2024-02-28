import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserDetailResponseDTO } from './dto/response/user-detail-response.dto';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtGuard)
  @Get('info')
  @UseInterceptors(NoFilesInterceptor())
  async getUser(@Request() request: any, @Res() response: Response) {
    try {
      console.log("request.user :", request.user)
      const responseData: UserDetailResponseDTO = await this.usersService.getUser(request.user.username);
      const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      console.log(error)
      response.json(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('hello-service')
  async getHello(@Request() request: any, @Res() response: Response) {
    try {
      console.log(request.user)
      const responseData = await this.usersService.getHello();
      const successResponse = new CommonResponseDto(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }
}
