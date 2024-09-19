import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      // transport: {
      //   host: 'sandbox.smtp.mailtrap.io',
      //   port: 465,
      //   secure: false,
      //   auth: {
      //     user: '7a38e5502c8585',
      //     pass: '01d713ef94abef',
      //   },
      // },
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          // For SSL and TLS connection
          secure: true,
          port: 465,
          auth: {
            // Account gmail address
            user: configService.get('SMTP_MAIL'),
            pass: configService.get('SMTP_PASSWORD')
          },
        },
        defaults: {
          from: '"No Reply" <afdulrohmat03@gmail.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule { }
