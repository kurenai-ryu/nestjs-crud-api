import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/index';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getLast(): Promise<User> {
    try {
      const lastUser = await this.userRepository.findOne({
        order: { user_id: 'DESC' },
      });
      
      if (!lastUser) {
        throw new HttpException(
          'No users found.',
          HttpStatus.NOT_FOUND,
        );
      }
      
      return lastUser;
    } catch (err) {
      console.log('Get last user error: ', err.message ?? err);
      throw err;
    }
  }

  async getOneById(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { user_id: id },
      });
    } catch (err) {
      console.log('Get one user by id error: ', err.message ?? err);
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async create(user: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists.',
        HttpStatus.CONFLICT,
      );
    }

    const createdUser = this.userRepository.create(user);
    return await this.userRepository.save(createdUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    let foundUser = await this.userRepository.findOneBy({
      user_id: id,
    });

    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if email is being updated and if it already exists
    if (user.email && user.email !== foundUser.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });

      if (existingUser) {
        throw new HttpException(
          'User with this email already exists.',
          HttpStatus.CONFLICT,
        );
      }
    }

    foundUser = { ...foundUser, ...user, updated_at: new Date() };
    return await this.userRepository.save(foundUser);
  }

  async delete(id: number): Promise<number> {
    let foundUser = await this.userRepository.findOneBy({
      user_id: id,
    });

    if (!foundUser) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.userRepository.delete(id);
    return foundUser.user_id;
  }
}
