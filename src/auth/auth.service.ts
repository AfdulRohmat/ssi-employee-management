import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterRequestDTO } from './dto/request/register-request.dto';
import { RegisterResponseDTO } from './dto/response/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async register(request: RegisterRequestDTO): Promise<User> {
    const user = this.userRepository.create(request);
    return this.userRepository.save(user);

    // return new RegisterResponseDTO(user.email, user.username, "Mohon check email anda")
  }
}
