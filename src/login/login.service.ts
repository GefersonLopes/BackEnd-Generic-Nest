import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { BadRequest, BodyNull } from 'src/middlewares/Verifications/';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { NotAuthorized } from 'src/middlewares/Verifications';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async verifyUser(loginDto: LoginDto) {
    const { email, password } = loginDto;
    BodyNull([email, password]);

    const user = await this.userRepository.findOne({ where: { email } });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user?.email || !isPasswordValid) {
      return null;
    }

    return user;
  }

  verifyToken(token: string) {
    const verifyToken = this.jwtService.verifyAsync(token, {
      secret: process.env.SECRET_KEY,
    });
    if (!verifyToken) {
      NotAuthorized();
    }

    return verifyToken;
  }

  async login(loginDto: LoginDto) {
    const verifyUser = await this.verifyUser(loginDto);
    if (!verifyUser) {
      BadRequest('Email or password incorrect');
    }

    const { id, name, email } = verifyUser;
    const token = await this.jwtService.signAsync({ id, name, email });

    return { token };
  }
}
