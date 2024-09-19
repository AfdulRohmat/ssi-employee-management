import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { UserDetailResponseDTO } from './dto/response/user-detail-response.dto';
import { CommonResponseDTO } from 'src/utils/common-response.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Get current user information' })
  @ApiBearerAuth() // Add this line
  @UseGuards(JwtGuard)
  @Get('info')
  @UseInterceptors(NoFilesInterceptor())
  async getUser(@Request() request: any, @Res() response: Response) {
    try {
      console.log("request.user :", request.user)
      const responseData: UserDetailResponseDTO = await this.usersService.getUser(request.user.username);
      const successResponse = new CommonResponseDTO(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      console.log(error)
      response.json(error);
    }
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth() // Add this line
  @Get('hello-service')
  async getHello(@Request() request: any, @Res() response: Response) {
    try {
      console.log(request.user)
      const responseData = await this.usersService.getHello();
      const successResponse = new CommonResponseDTO(200, 'Proses berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }
}
