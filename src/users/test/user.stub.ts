import { User } from '../user.entity';

export const usersStub = (): User[] => {
  return [
    {
      user_id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      created_at: new Date('2024-01-01T10:00:00.000Z'),
      updated_at: new Date('2024-01-01T10:00:00.000Z'),
    },
    {
      user_id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+0987654321',
      created_at: new Date('2024-01-02T11:00:00.000Z'),
      updated_at: new Date('2024-01-02T11:00:00.000Z'),
    },
  ];
};

export const userStub = (): User => {
  return {
    user_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    created_at: new Date('2024-01-01T10:00:00.000Z'),
    updated_at: new Date('2024-01-01T10:00:00.000Z'),
  };
};

export const createUserDtoStub = () => {
  return {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
  };
};
