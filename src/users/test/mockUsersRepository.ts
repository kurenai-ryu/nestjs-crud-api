import { User } from '../user.entity';
import { usersStub, userStub } from './user.stub';

export const mockUsersRepository = {
  find: jest.fn().mockResolvedValue(usersStub()),
  findOneOrFail: jest.fn().mockResolvedValue(userStub()),
  findOneBy: jest.fn().mockResolvedValue(userStub()),
  findOne: jest.fn().mockImplementation((options) => {
    // Check if it's the last user query (with order)
    if (options && options.order && options.order.user_id === 'DESC') {
      return Promise.resolve(userStub());
    }
    // Default to null for email uniqueness check
    return Promise.resolve(null);
  }),
  create: jest.fn().mockResolvedValue(userStub()),
  save: jest.fn((user: User) => user),
  delete: jest.fn((id: number) => id),
};
