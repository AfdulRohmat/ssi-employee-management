import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { CommonResponseDTO } from 'src/utils/common-response.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { RegisterResponseDTO } from './dto/response/register-response.dto';
import { ActivateAccountRequestDTO } from './dto/request/activate-account-request.dto';
import { ActivateAccountResponseDTO } from './dto/response/activate-account-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('register')
  @UseInterceptors(NoFilesInterceptor())
  async register(@Body() request: RegisterRequestDTO, @Res() response: Response): Promise<RegisterResponseDTO | any> {
    try {
      const responseData: RegisterResponseDTO = await this.authService.register(request);

      const successResponse = new CommonResponseDTO(201, 'Proses registrasi berhasil. Silahkan cek email anda', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }

  @Post('activate-account')
  @UseInterceptors(NoFilesInterceptor())
  async activateAccount(@Body() request: ActivateAccountRequestDTO, @Res() response: Response): Promise<ActivateAccountResponseDTO | any> {
    try {
      const responseData: ActivateAccountResponseDTO = await this.authService.activateAccount(request);

      const successResponse = new CommonResponseDTO(200, 'Proses aktivasi berhasil. Silahkan login', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // @UseInterceptors(NoFilesInterceptor())
  async login(@Request() request: any, @Res() response: Response) {
    try {

      const responseData = await this.authService.login(request.user)

      const successResponse = new CommonResponseDTO(200, 'Login berhasil', responseData, null);
      return response.status(successResponse.statusCode).json(successResponse);
    } catch (error) {
      response.status(error.status).json(error.response);
    }
  }

}
