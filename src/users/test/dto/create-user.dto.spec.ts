import { validate } from 'class-validator';
import { CreateUserDto } from '../../dto/create-user.dto';

describe('CreateUserDto', () => {
  it('should be defined', () => {
    expect(new CreateUserDto()).toBeDefined();
  });

  it('should pass validation with valid data', async () => {
    const dto = new CreateUserDto();
    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.phone = '+1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with empty first_name', async () => {
    const dto = new CreateUserDto();
    dto.first_name = '';
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with invalid email', async () => {
    const dto = new CreateUserDto();
    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should pass validation without phone (optional field)', async () => {
    const dto = new CreateUserDto();
    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';
    // phone is not set (optional)

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with first_name too short', async () => {
    const dto = new CreateUserDto();
    dto.first_name = 'J'; // Too short (min 2 characters)
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should fail validation with first_name too long', async () => {
    const dto = new CreateUserDto();
    dto.first_name = 'A'.repeat(256); // Too long (max 255 characters)
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });
});
