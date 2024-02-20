import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow('DATABASE_HOST'),
                port: configService.getOrThrow<number>('DATABASE_PORT'),
                username: configService.getOrThrow('DATABASE_USER'),
                password: configService.getOrThrow('DATABASE_PASSWORD'),
                database: configService.getOrThrow('DATABASE_NAME'),
                synchronize: true, // Disable in production
                autoLoadEntities: true,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
            }),
        }),
    ],
})
export class DatabaseModule { }
