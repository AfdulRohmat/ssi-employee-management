import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { RegisterResponseDTO } from './dto/response/register-response.dto';
import * as bcrypt from 'bcrypt';
import { Role, UserRole } from 'src/users/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async register(request: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    // bcrypt password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    // generate random activation code
    const activationCode: number = Math.floor(100000 + Math.random() * 900000)

    // send to email

    // adding role
    const userRole = new Role();
    userRole.name = UserRole.USER
    await this.roleRepository.save(userRole)

    // adding user
    const user = new User();
    user.username = request.username
    user.email = request.email
    user.password = hashedPassword
    user.isVerified = false
    user.activationCode = activationCode
    user.roles = [userRole]

    await this.userRepository.save(user);

    return new RegisterResponseDTO(user.email, user.username, "Registrasi berhasil Mohon check email anda")
  }
}
