import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AddEmployeeRequestDTO } from './dto/request/add-employe-request.dto';
import { Employee } from './entities/employee.entity';

import { CommonResponseDto } from 'src/utils/common-response.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorageConfig } from 'src/cloudinary/cloudinary.storage';


@UseGuards(JwtGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post("add-employee")
  @UseInterceptors(FileInterceptor('foto', { storage: CloudinaryStorageConfig }))
  async addEmployee(@Body() addEmployeeRequestDTO: AddEmployeeRequestDTO,
    @UploadedFile() foto: Express.Multer.File,
    @Res() response: Response) {
    const responseData: Employee = await this.employeesService.addEmployee(addEmployeeRequestDTO, foto)
    const successResponse = new CommonResponseDto(200, 'Process Success', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
