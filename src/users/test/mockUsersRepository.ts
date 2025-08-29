import { User } from '../user.entity';
import { usersStub, userStub } from './user.stub';

export const mockUsersRepository = {
  find: jest.fn().mockResolvedValue(usersStub()),
  findOneOrFail: jest.fn().mockResolvedValue(userStub()),
  findOneBy: jest.fn().mockResolvedValue(userStub()),
  findOne: jest.fn().mockResolvedValue(null), // Default to null for email uniqueness check
  create: jest.fn().mockResolvedValue(userStub()),
  save: jest.fn((user: User) => user),
  delete: jest.fn((id: number) => id),
};
