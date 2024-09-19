import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, UseInterceptors, UploadedFile, Query, Put } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AddEmployeeRequestDTO } from './dto/request/add-employe-request.dto';
import { Employee } from './entities/employee.entity';
import { CommonResponseDTO } from 'src/utils/common-response.dto';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorageConfig } from 'src/cloudinary/cloudinary.storage';
import { UpdateEmployeeRequestDTO } from './dto/request/update-employe-request.dto';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'fast-csv';
import { diskStorage } from 'multer';

const storage = diskStorage({
  destination: './uploads', // Specify the uploads directory
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 4);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

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
    const successResponse = new CommonResponseDTO(200, 'Process Success', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @Get("all-employees")
  async getAllEmployees(
    @Query('page') page: number = 1, // Default to page 1
    @Query('limit') limit: number = 10, // Default limit to 10
    @Query('search') search: string,
    @Res() response: Response
  ) {
    const employees = await this.employeesService.getAllEmployees(page, limit, search);
    const successResponse = new CommonResponseDTO(200, 'Employees Retrieved Successfully', employees, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  // Get employee by ID
  @Get(':id')
  async getEmployeeById(@Param('id') id: string, @Res() response: Response) {
    const employee = await this.employeesService.getEmployeeById(parseInt(id));
    const successResponse = new CommonResponseDTO(200, 'Employee Retrieved Successfully', employee, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  // Update employee by ID
  @Put(':id/update')
  @UseInterceptors(FileInterceptor('foto', { storage: CloudinaryStorageConfig }))
  async updateEmployeeById(
    @Param('id') id: string,
    @Body() updateEmployeeDTO: UpdateEmployeeRequestDTO,
    @Res() response: Response,
    @UploadedFile() foto?: Express.Multer.File,
  ) {
    const updatedEmployee = await this.employeesService.updateEmployeeById(parseInt(id), updateEmployeeDTO, foto);
    const successResponse = new CommonResponseDTO(200, 'Employee Updated Successfully', updatedEmployee, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  // Soft delete employee by ID
  @Delete(':id/delete')
  async deleteEmployeeById(@Param('id') id: string, @Res() response: Response) {
    await this.employeesService.softDeleteEmployeeById(parseInt(id));
    const successResponse = new CommonResponseDTO(200, 'Employee Deleted Successfully', null, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @Post('import-csv')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    if (!file) {
      return response.status(400).json(new CommonResponseDTO(400, 'File not uploaded', null, null));
    }

    console.log('Uploaded file:', file);

    const employees: any = [];

    const filePath = path.join(__dirname, '../../uploads', file.filename);

    fs.createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on('data', (row) => {
        employees.push(row);
      })
      .on('end', async () => {
        const savedEmployees = await this.employeesService.importEmployees(employees);
        const successResponse = new CommonResponseDTO(200, 'Employees Imported Successfully', savedEmployees, null);
        return response.status(successResponse.statusCode).json(successResponse);
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        return response.status(500).json(new CommonResponseDTO(500, 'Error reading CSV file', null, [err.message]));
      });
  }

  @Get('export-data/per-page')
  async exportEmployeesFromPage(
    @Query('format') format: 'csv' | 'pdf',
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() response: Response
  ) {
    const data = await this.employeesService.getPaginatedEmployees(page, size);

    if (format === 'csv') {
      return this.employeesService.exportToCSV(data, response);
    } else if (format === 'pdf') {
      const buffer = await this.employeesService.exportToPDF(data);
      response.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=employees.pdf',
        'Content-Length': buffer.length,
      })

      response.end(buffer)
    } else {
      response.status(400).json({ message: 'Invalid export format' });
    }
  }

  @Get('export-data/all')
  async exportAllEmployees(
    @Query('format') format: 'csv' | 'pdf',
    @Res() response: Response
  ) {
    const data = await this.employeesService.getAllEmployeesData();

    if (format === 'csv') {
      return this.employeesService.exportToCSV(data, response);
    } else if (format === 'pdf') {
      const buffer = await this.employeesService.exportToPDF(data);

      response.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=employees.pdf',
        'Content-Length': buffer.length,
      })

      response.end(buffer)
    } else {
      response.status(400).json({ message: 'Invalid export format' });
    }
  }
}

