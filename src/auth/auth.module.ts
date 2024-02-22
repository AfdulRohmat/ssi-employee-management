import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/users/entities/role.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from 'src/email/email.module';


@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([
      User,
      Role
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService,],
})
export class AuthModule { }
