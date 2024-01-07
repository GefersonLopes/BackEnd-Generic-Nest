import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import db from './config/db';
import { APP_FILTER } from '@nestjs/core';
import { ErrorMiddleware } from './middlewares/Erros';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...db,
    }),
    UserModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorMiddleware,
    },
  ],
})
export class AppModule {}
