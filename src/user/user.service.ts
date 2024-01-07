import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AlreadyExists,
  BadRequest,
  BodyNull,
  NotFound,
} from 'src/middlewares/Verifications/';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    BodyNull([name, email, password]);

    const findEmail = await this.userRepository.findOne({ where: { email } });
    if (findEmail) AlreadyExists(email);
    if (password.length < 8) {
      BadRequest('Password must be at least 8 characters');
    }

    createUserDto.password = await bcrypt.hash(
      password,
      +process.env.PASSWORD_ROUND_HASH,
    );

    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    NotFound(findUser, 'User not found');
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;

    const findUser = await this.userRepository.findOne({ where: { id } });
    NotFound(findUser, 'User not found');

    if (password) {
      if (password.length < 8) {
        BadRequest('Password must be at least 8 characters');
      }

      if (password === findUser.password) {
        BadRequest('Password must be different from the current one');
      }
    }

    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    NotFound(findUser, 'User not found');

    this.userRepository.delete(id);
  }
}
