import { validate } from 'class-validator';
import { UpdateUserDto } from '../../dto/update-user.dto';

describe('UpdateUserDto', () => {
  it('should be defined', () => {
    expect(new UpdateUserDto()).toBeDefined();
  });

  it('should pass validation with partial data', async () => {
    const dto = new UpdateUserDto();
    dto.first_name = 'John';
    // Only setting first_name, other fields are optional

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with empty object', async () => {
    const dto = new UpdateUserDto();
    // No fields set, all are optional

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email when provided', async () => {
    const dto = new UpdateUserDto();
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should pass validation with valid email when provided', async () => {
    const dto = new UpdateUserDto();
    dto.email = 'john.doe@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with first_name too short when provided', async () => {
    const dto = new UpdateUserDto();
    dto.first_name = 'J'; // Too short (min 2 characters)

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should pass validation with valid first_name when provided', async () => {
    const dto = new UpdateUserDto();
    dto.first_name = 'John';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with all fields provided', async () => {
    const dto = new UpdateUserDto();
    dto.first_name = 'John';
    dto.last_name = 'Doe';
    dto.email = 'john.doe@example.com';
    dto.phone = '+1234567890';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
