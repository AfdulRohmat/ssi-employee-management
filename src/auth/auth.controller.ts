import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  async register(@Body() request: RegisterRequestDTO) {
    // const { username, email, password } = request.body

    // if (!username || !email || !password) {
    //   const errorResponse = new CommonResponseDto(400, 'Missing required fields', null, ['Missing required fields']);
    //   response.status(errorResponse.status).json(errorResponse);
    // }
    // const registerDto: RegisterRequestDTO = { username, email, password };
    return await this.authService.register(request);

    // try {
    //   const registerDto: RegisterRequestDTO = { username, email, password };

    //   const successResponse = new CommonResponseDto(201, 'User registered successfully', user, null);
    //   response.status(successResponse.status).json(successResponse);
    // } catch (error) {
    //   const errorResponse = new CommonResponseDto(500, 'Internal server error', null, ['Internal server error']);
    //   response.status(errorResponse.status).json(errorResponse);
    // }
  }

}
