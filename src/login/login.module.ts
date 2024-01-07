import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './authGuard';

@Module({
  controllers: [LoginController],
  providers: [LoginService, AuthGuard],
  exports: [LoginService, AuthGuard],
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_IN },
    }),
  ],
})
export class LoginModule {}
