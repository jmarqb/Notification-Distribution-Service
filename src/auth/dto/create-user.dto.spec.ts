import { CreateUserDto } from './create-user.dto';
import { validate } from 'class-validator';

describe('CreateUserDto', () => {
  it('should have correct properties', async () => {
    const userDto = new CreateUserDto();
    userDto.firstName = 'any name';
    userDto.lastName = 'any lastname';
    userDto.email = 'any@email.com';
    userDto.password = 'Abc123456';

    const errors = await validate(userDto);

    expect(errors.length).toBe(0);
    expect(userDto.firstName).toBeDefined();
    expect(userDto.email).toBeDefined();
    expect(userDto.password).toBeDefined();
  });

  it('should throw errors if password is not valid', async () => {
    const userDto = new CreateUserDto();
    userDto.firstName = 'any name';
    userDto.email = 'any@email.com';
    userDto.password = 'invalidPassword';

    const errors = await validate(userDto);

    const passwordError = errors.find((err) => err.property === 'password');
    const constraints = passwordError?.constraints;

    expect(passwordError).toBeDefined();
    expect(constraints).toBeDefined();
    expect(constraints?.matches).toBe(
      'The password must have a Uppercase, lowercase letter and a number',
    );
  });
});
