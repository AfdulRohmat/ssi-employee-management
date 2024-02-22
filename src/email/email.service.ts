import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(user: User) {

        await this.mailerService.sendMail({
            to: user.email,
            from: '"Support Team" <afdulrohmat03@gmail.com>', // override default from
            subject: 'Welcome to Tugas Akhir App! Confirm your Email',
            template: './confirmation', // `.hbs` extension is appended automatically
            context: { // ✏️ filling curly brackets with content
                name: user.username,
                activationCode: user.activationCode,
            },
        });
    }
}
