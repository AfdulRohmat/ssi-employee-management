import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterRequestDTO } from '../auth/dto/request/register-request.dto';
import { Role } from './entities/role.entity';
import { UserDetailResponseDTO } from './dto/response/user-detail-response.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) { }


    async getUser(email: string) {
        const user = await this.userRepository.findOneOrFail({
            where: {
                email: email
            }
        })

        return new UserDetailResponseDTO(user.username, user.email, user.isVerified, user.roles)
    }

    async getHello() {
        return 'Hello User Service!';
    }
}
