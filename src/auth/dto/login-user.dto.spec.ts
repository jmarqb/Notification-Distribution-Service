import { validate } from 'class-validator';
import { LoginUserDto } from './login-user.dto';
import { plainToClass } from 'class-transformer';

describe('LoginUserDto', () => {
  it('should have correct properties', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'any@email.com',
      password: 'Abc123456',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
    expect(dto.email).toBeDefined();
    expect(dto.password).toBeDefined();
  });

  it('should throw errors if password is not valid', async () => {
    const dto = plainToClass(LoginUserDto, {
      email: 'any@email.com',
      password: 'invalidPassword',
    });

    const errors = await validate(dto);

    const passwordError = errors.find((err) => err.property === 'password');
    const constraints = passwordError?.constraints;

    expect(passwordError).toBeDefined();
    expect(constraints).toBeDefined();
    expect(constraints?.matches).toBe(
      'The password must have a Uppercase, lowercase letter and a number',
    );
  });
});
