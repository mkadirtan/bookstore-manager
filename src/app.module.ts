import { Module } from '@nestjs/common';
import { BookstoreModule } from './bookstore/bookstore.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvVars: false }),
    TypeOrmModule.forRoot({
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    BookstoreModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
