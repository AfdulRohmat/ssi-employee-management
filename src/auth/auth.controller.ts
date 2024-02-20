import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { CommonResponseDto } from 'src/utils/common-response.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { RegisterResponseDTO } from './dto/response/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  async register(@Body() request: RegisterRequestDTO, @Res() response: Response): Promise<RegisterResponseDTO | any> {

    try {
      const registerResponseDto: RegisterResponseDTO = await this.authService.register(request);

      const successResponse = new CommonResponseDto(201, 'User registered successfully', registerResponseDto, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      const errorResponse = new CommonResponseDto(500, 'Internal server error', null, ['Internal server error']);
      response.status(errorResponse.statusCode).json(errorResponse);
    }
  }

}
