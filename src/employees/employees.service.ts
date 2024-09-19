import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { AddEmployeeRequestDTO } from './dto/request/add-employe-request.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) { }

  async addEmployee(addEmployeeRequestDTO: AddEmployeeRequestDTO, fotoFile: Express.Multer.File) {
    const employee = new Employee()
    employee.nama = addEmployeeRequestDTO.nama
    Object.assign(employee, addEmployeeRequestDTO);
    employee.foto = fotoFile.path

    return await this.employeeRepository.save(employee)
  }

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
