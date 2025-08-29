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

export const randomUserApiStub = () => {
  return {
    data: {
      results: [
        {
          gender: 'female',
          name: {
            title: 'Ms',
            first: 'Katherine',
            last: 'Soto',
          },
          location: {
            street: {
              number: 15,
              name: 'Ormond Quay',
            },
            city: 'Celbridge',
            state: 'Kilkenny',
            country: 'Ireland',
            postcode: 40244,
            coordinates: {
              latitude: '3.3827',
              longitude: '137.3880',
            },
            timezone: {
              offset: '-5:00',
              description: 'Eastern Time (US & Canada), Bogota, Lima',
            },
          },
          email: 'katherine.soto@example.com',
          login: {
            uuid: '8dd30936-5353-49ba-813b-d1c3a6b11fa2',
            username: 'sadswan203',
            password: 'camille',
            salt: 'puoMRPpf',
            md5: '56c68148e69f71c895ae2476b28a3b4b',
            sha1: 'fad70da0592c25d6f9ffa99cce801db3ffc58fc7',
            sha256: '83268bb227349944686cec3794dbbb8168d75cfa9dbeb8e0492bd41015df40ed',
          },
          dob: {
            date: '1988-08-22T21:28:36.357Z',
            age: 37,
          },
          registered: {
            date: '2006-04-07T19:37:18.477Z',
            age: 19,
          },
          phone: '031-701-9611',
          cell: '081-252-0617',
          id: {
            name: 'PPS',
            value: '6661222T',
          },
          picture: {
            large: 'https://randomuser.me/api/portraits/women/64.jpg',
            medium: 'https://randomuser.me/api/portraits/med/women/64.jpg',
            thumbnail: 'https://randomuser.me/api/portraits/thumb/women/64.jpg',
          },
          nat: 'IE',
        },
      ],
      info: {
        seed: '2de749080c8152a7',
        results: 1,
        page: 1,
        version: '1.4',
      },
    },
  };
};
