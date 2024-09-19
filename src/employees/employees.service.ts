import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { IsNull, Repository } from 'typeorm';
import { AddEmployeeRequestDTO } from './dto/request/add-employe-request.dto';
import { UpdateEmployeeRequestDTO } from './dto/request/update-employe-request.dto';
import { EmployeeResponseDto as EmployeeResponseDTO } from './dto/response/employe-response.dto';
import { PaginationResponseDto as PaginationResponseDTO } from 'src/utils/pagination-response.dto';
import { createObjectCsvWriter } from 'csv-writer';
import { Response } from 'express';
// import * as PDFDocument from 'pdfkit'
import PDFDocument from 'pdfkit-table';


@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) { }

  async getAllEmployees(page: number, limit: number, searchTerm?: string): Promise<PaginationResponseDTO<EmployeeResponseDTO>> {
    const employeeQueryBuilder = this.employeeRepository.createQueryBuilder('employee');

    employeeQueryBuilder.where('employee.deleted_at IS NULL')

    if (searchTerm) {
      employeeQueryBuilder.andWhere(
        '(employee.nama ILIKE :searchTerm OR employee.nomor LIKE :searchTerm OR employee.jabatan LIKE :searchTerm OR employee.departemen LIKE :searchTerm)',
        {
          searchTerm: `%${searchTerm}%`
        }
      )
    }

    const [employees, totalData] = await employeeQueryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const responseData = employees.map((employee, index) => new EmployeeResponseDTO(employee, (page - 1) * limit + index + 1));

    const totalPage = Math.ceil(totalData / limit);

    return new PaginationResponseDTO(page, limit, totalPage, totalData, responseData);
  }

  async addEmployee(addEmployeeRequestDTO: AddEmployeeRequestDTO, fotoFile: Express.Multer.File) {
    const employee = new Employee()

    Object.assign(employee, addEmployeeRequestDTO);
    employee.foto = fotoFile.path

    return await this.employeeRepository.save(employee)
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id, deleted_at: IsNull() }, // Check for null in deleted_at
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async softDeleteEmployeeById(id: number): Promise<void> {
    const employee = await this.getEmployeeById(id);

    employee.deleted_at = new Date(); // Set the deletion timestamp

    await this.employeeRepository.save(employee);
  }

  // Update an employee by ID
  async updateEmployeeById(id: number, updateEmployeeDTO: UpdateEmployeeRequestDTO, fotoFile?: Express.Multer.File): Promise<Employee> {
    const employee = await this.getEmployeeById(id);

    Object.assign(employee, updateEmployeeDTO);

    if (fotoFile) {
      employee.foto = fotoFile.path; // update the 'foto' if a new one is uploaded
    }

    return await this.employeeRepository.save(employee);
  }

  // Import Data From CSV
  async importEmployees(employeeData: any[]): Promise<Employee[]> {

    const employees = employeeData.map(data => {
      const employee = new Employee();
      employee.nama = data.nama;
      employee.nomor = data.nomor;
      employee.jabatan = data.jabatan;
      employee.departemen = data.departemen;

      // Parse the date and handle any potential errors
      const parsedDate = new Date(data.tanggal_masuk);
      if (isNaN(parsedDate.getTime())) {
        console.error(`Invalid date format for entry: ${data.tanggal_masuk}`);
        throw new Error(`Invalid date format for entry: ${data.tanggal_masuk}`);
      }
      employee.tanggalMasuk = parsedDate;

      employee.foto = data.foto; // Handle this as necessary
      employee.status = data.status;

      return employee;
    });

    return await this.employeeRepository.save(employees);
  }

  async getAllEmployeesData(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: { deleted_at: IsNull() },
    });
  }

  async getPaginatedEmployees(page: number, size: number): Promise<Employee[]> {
    const [employees] = await this.employeeRepository.findAndCount({
      where: { deleted_at: IsNull() },
      skip: (page - 1) * size,
      take: size,
    });
    return employees;
  }

  async exportToCSV(data: Employee[], response: Response) {
    const csvWriter = createObjectCsvWriter({
      path: './uploads/employees.csv',
      header: [
        { id: 'nama', title: 'Nama' },
        { id: 'nomor', title: 'Nomor' },
        { id: 'jabatan', title: 'Jabatan' },
        { id: 'departemen', title: 'Departemen' },
        { id: 'tanggalMasuk', title: 'Tanggal Masuk' },
        { id: 'foto', title: 'Foto' },
        { id: 'status', title: 'Status' },
      ],
    });

    await csvWriter.writeRecords(data);
    response.download('./uploads/employees.csv', 'employees.csv');
  }

  async exportToPDF(data: Employee[]): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      const doc = new PDFDocument({
        size: 'A4',
        margin: 30,
      });

      // Capture the PDF output as a buffer
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Table setup
      const table = {
        title: 'Data Karyawan',
        headers: [
          { label: 'No', property: 'no', width: 50 },
          { label: 'Nama', property: 'nama', width: 120 },
          { label: 'Nomor', property: 'nomor', width: 80 },
          { label: 'Jabatan', property: 'jabatan', width: 100 },
          { label: 'Departemen', property: 'departemen', width: 100 },
          { label: 'Tanggal Masuk', property: 'tanggalMasuk', width: 80 },
          { label: 'Status', property: 'status', width: 80 },
        ],
        rows: data.map((employee, index) => [
          (index + 1).toString(), // No (converted to string)
          employee.nama,
          employee.nomor,
          employee.jabatan,
          employee.departemen,
          employee.tanggalMasuk.toLocaleDateString(),
          employee.status,
        ]),
      };

      // Write table to document
      doc.table(table, {
        prepareHeader: () => doc.font('Helvetica-Bold').fontSize(8),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          return doc.font('Helvetica').fontSize(8);
        },
      });

      // Finalize the document
      doc.end();
    });

    return pdfBuffer;
  }
}
