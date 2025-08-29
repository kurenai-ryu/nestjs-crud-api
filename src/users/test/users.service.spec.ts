import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { UsersService } from '../users.service';
import { mockUsersRepository } from './mockUsersRepository';
import { usersStub, userStub, createUserDtoStub, randomUserApiStub } from './user.stub';
import axios from 'axios';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    // Mock axios
    jest.spyOn(axios, 'get').mockResolvedValue(randomUserApiStub());
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users = await service.getAll();
      expect(users).toEqual(usersStub());
      expect(userRepository.find).toBeCalledTimes(1);
    });
  });

  describe('getLast', () => {
    it('should return the last user added', async () => {
      const lastUser = await service.getLast();
      expect(lastUser).toEqual(userStub());
      expect(userRepository.findOne).toBeCalledWith({
        order: { user_id: 'DESC' },
      });
    });

    it('should return an http error when no users exist', async () => {
      const spy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(null);
      
      await expect(service.getLast()).rejects.toThrowError(HttpException);
      expect(spy).toBeCalledWith({
        order: { user_id: 'DESC' },
      });
    });
  });

  describe('getOneById', () => {
    it('should get a single user', async () => {
      const user = await service.getOneById(1);
      expect(user).toEqual(userStub());
      expect(userRepository.findOneOrFail).toBeCalledWith({
        where: { user_id: 1 },
      });
    });

    it("should return an http error when user id doesn't exist", async () => {
      const id = 10;
      const spy = jest
        .spyOn(userRepository, 'findOneOrFail')
        .mockImplementationOnce(() => {
          throw new HttpException(
            `User with id ${id} not found.`,
            HttpStatus.NOT_FOUND,
          );
        });
      await expect(service.getOneById(id)).rejects.toThrowError(HttpException);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({
        where: { user_id: id },
      });
    });
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto = createUserDtoStub();
      const user = await service.create(createUserDto);
      expect(user).toEqual(userStub());
      expect(userRepository.findOne).toBeCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userRepository.create).toBeCalledWith(createUserDto);
      expect(userRepository.save).toBeCalledTimes(1);
    });

    it('should throw an error when email already exists', async () => {
      const createUserDto = createUserDtoStub();
      const spy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userStub()); // Email already exists

      await expect(service.create(createUserDto)).rejects.toThrowError(
        new HttpException(
          'User with this email already exists.',
          HttpStatus.CONFLICT,
        ),
      );
      expect(spy).toBeCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userRepository.create).toBeCalledTimes(0);
      expect(userRepository.save).toBeCalledTimes(0);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { first_name: 'Updated' };
      const updatedUser = await service.update(1, updateData);
      expect(updatedUser).toEqual({
        ...userStub(),
        ...updateData,
        updated_at: updatedUser.updated_at,
      });
      expect(userRepository.findOneBy).toBeCalledWith({
        user_id: 1,
      });
      expect(userRepository.save).toBeCalledTimes(1);
    });

    it("should return an http error when user id doesn't exist", async () => {
      const id = 10;
      const updateData = { first_name: 'Updated' };
      const spy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(() => undefined);
      await expect(service.update(id, updateData)).rejects.toThrowError(
        HttpException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        user_id: id,
      });
      expect(userRepository.save).toHaveBeenCalledTimes(0);
    });

    it('should throw an error when updating email to an existing one', async () => {
      const updateData = { email: 'existing@example.com' };
      const existingUser = userStub();
      existingUser.email = 'existing@example.com';
      
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(userStub());
      const spy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(existingUser); // Email already exists

      await expect(service.update(1, updateData)).rejects.toThrowError(
        new HttpException(
          'User with this email already exists.',
          HttpStatus.CONFLICT,
        ),
      );
      expect(spy).toBeCalledWith({
        where: { email: updateData.email },
      });
      expect(userRepository.save).toBeCalledTimes(0);
    });

    it('should allow updating email to the same email', async () => {
      const existingUser = userStub();
      const updateData = { email: existingUser.email };
      
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce(existingUser);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const updatedUser = await service.update(1, updateData);
      expect(updatedUser).toEqual({
        ...existingUser,
        ...updateData,
        updated_at: updatedUser.updated_at,
      });
      expect(userRepository.save).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deletedId = await service.delete(1);
      expect(deletedId).toEqual(1);
      expect(userRepository.findOneBy).toBeCalledWith({
        user_id: 1,
      });
      expect(userRepository.delete).toBeCalledTimes(1);
    });

    it("should return an http error when user id doesn't exist", async () => {
      const id = 10;
      const spy = jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(() => undefined);
      await expect(service.delete(id)).rejects.toThrowError(HttpException);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({
        user_id: id,
      });
      expect(userRepository.delete).toBeCalledTimes(0);
    });
  });

  describe('createRandomUser', () => {
    it('should successfully create a random user', async () => {
      const randomUser = await service.createRandomUser();
      expect(randomUser).toEqual(userStub());
      expect(axios.get).toBeCalledWith('https://randomuser.me/api/');
      expect(userRepository.findOne).toBeCalledWith({
        where: { email: 'katherine.soto@example.com' },
      });
      expect(userRepository.create).toBeCalledWith({
        first_name: 'Katherine',
        last_name: 'Soto',
        email: 'katherine.soto@example.com',
        phone: '031-701-9611',
      });
      expect(userRepository.save).toBeCalledTimes(1);
    });

    it('should throw an error when email already exists', async () => {
      const spy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(userStub()); // Email already exists

      await expect(service.createRandomUser()).rejects.toThrowError(
        new HttpException(
          'User with this email already exists.',
          HttpStatus.CONFLICT,
        ),
      );
      expect(spy).toBeCalledWith({
        where: { email: 'katherine.soto@example.com' },
      });
      expect(userRepository.create).toBeCalledTimes(0);
      expect(userRepository.save).toBeCalledTimes(0);
    });

    it('should throw an error when external API fails', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('API Error'));

      await expect(service.createRandomUser()).rejects.toThrowError(
        new HttpException(
          'Failed to create random user. Please try again.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(userRepository.findOne).toBeCalledTimes(0);
      expect(userRepository.create).toBeCalledTimes(0);
      expect(userRepository.save).toBeCalledTimes(0);
    });
  });
});
