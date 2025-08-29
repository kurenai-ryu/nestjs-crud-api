import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { usersStub, userStub, createUserDtoStub } from './user.stub';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn().mockResolvedValue(usersStub()),
            getOneById: jest.fn().mockResolvedValue(userStub()),
            create: jest.fn().mockResolvedValue(userStub()),
            update: jest.fn().mockResolvedValue(userStub()),
            delete: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users = await controller.getAll();
      expect(users).toEqual(usersStub());
      expect(service.getAll).toBeCalledTimes(1);
    });
  });

  describe('getOne', () => {
    it('should return a single user', async () => {
      const user = await controller.getOne(1);
      expect(user).toEqual(userStub());
      expect(service.getOneById).toBeCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = createUserDtoStub();
      const user = await controller.create(createUserDto);
      expect(user).toEqual(userStub());
      expect(service.create).toBeCalledWith(createUserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { first_name: 'Updated' };
      const user = await controller.update(1, updateData);
      expect(user).toEqual(userStub());
      expect(service.update).toBeCalledWith(1, updateData);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deletedId = await controller.delete(1);
      expect(deletedId).toEqual(1);
      expect(service.delete).toBeCalledWith(1);
    });
  });
});
