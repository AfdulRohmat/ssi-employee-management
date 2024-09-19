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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StatusEnum } from './entities/status.enum';

const storage = diskStorage({
  destination: './uploads', // Specify the uploads directory
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 4);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

@ApiTags('employees') // Tag for Swagger UI
@ApiBearerAuth() // Add this line
@UseGuards(JwtGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @ApiOperation({ summary: 'Add a new employee' }) // Swagger operation description
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Request body for adding a new employee',
    type: AddEmployeeRequestDTO,
    examples: {
      a: {
        summary: 'Example Employee Data',
        value: {
          nama: 'Afdul Rohmat',
          nomor: 'EMP123',
          jabatan: 'Software Engineer',
          departemen: 'IT',
          tanggalMasuk: '2023-09-01',
          status: 'kontrak',
          foto: {
            type: 'string',
            format: 'binary', // Indicates a file input
            description: 'Profile photo of the employee',
          },
        },
      },
    },
  })
  @Post("add-employee")
  @UseInterceptors(FileInterceptor('foto', { storage: CloudinaryStorageConfig }))
  async addEmployee(@Body() addEmployeeRequestDTO: AddEmployeeRequestDTO,
    @UploadedFile() foto: Express.Multer.File,
    @Res() response: Response) {
    const responseData: Employee = await this.employeesService.addEmployee(addEmployeeRequestDTO, foto)
    const successResponse = new CommonResponseDTO(200, 'Process Success', responseData, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @ApiOperation({ summary: 'Retrieve all employees' }) // Description
  @ApiQuery({ name: 'page', required: false, description: 'Page number' }) // Query parameter documentation
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of records' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by employee name or other attributes' })
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
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @Get(':id')
  async getEmployeeById(@Param('id') id: string, @Res() response: Response) {
    const employee = await this.employeesService.getEmployeeById(parseInt(id));
    const successResponse = new CommonResponseDTO(200, 'Employee Retrieved Successfully', employee, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  // Update employee by ID
  @ApiOperation({ summary: 'Update an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Request body for updating an employee',
    type: UpdateEmployeeRequestDTO,
    examples: {
      a: {
        summary: 'Example Update Employee Data',
        value: {
          nama: 'John Doe',
          nomor: 'EMP456',
          jabatan: 'Senior Developer',
          departemen: 'Engineering',
          tanggalMasuk: '2020-01-15',
          status: 'tetap',
          foto: {
            type: 'string',
            format: 'binary', // Indicates a file input
            description: 'Profile photo of the employee',
          },
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Soft delete an employee by ID' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @Delete(':id/delete')
  async deleteEmployeeById(@Param('id') id: string, @Res() response: Response) {
    await this.employeesService.softDeleteEmployeeById(parseInt(id));
    const successResponse = new CommonResponseDTO(200, 'Employee Deleted Successfully', null, null);
    return response.status(successResponse.statusCode).json(successResponse);
  }

  @ApiOperation({ summary: 'Import employees from a CSV file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Request body for updating an employee',
    type: UpdateEmployeeRequestDTO,
    examples: {
      a: {
        summary: 'Example import csv Employee Data',
        value: {
          file: {
            type: 'string',
            format: 'binary', // Indicates a file input
            description: 'Profile photo of the employee',
          },
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Export employees data by page in CSV or PDF' })
  @ApiQuery({ name: 'format', required: true, description: 'Export format: csv or pdf', enum: ['csv', 'pdf'] })
  @ApiQuery({ name: 'page', required: true, description: 'Page number' })
  @ApiQuery({ name: 'size', required: true, description: 'Number of employees per page' })
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

  @ApiOperation({ summary: 'Export all employees data in CSV or PDF' })
  @ApiQuery({ name: 'format', required: true, description: 'Export format: csv or pdf', enum: ['csv', 'pdf'] })
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

