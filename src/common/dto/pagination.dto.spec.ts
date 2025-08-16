import { plainToClass } from 'class-transformer';
import { PaginationDto } from './pagination.dto';
import { validate } from 'class-validator';

describe('PaginationDto', () => {
  it('should work with default parameters', async () => {
    const dto = plainToClass(PaginationDto, {});

    const errors = await validate(dto);

    expect(dto).toBeDefined();
    expect(errors.length).toBe(0);
  });

  it('should validate limit as a positive number', async () => {
    const dto = plainToClass(PaginationDto, { limit: -1 });

    const errors = await validate(dto);

    const limitError = errors.find((err) => err.property === 'limit');

    expect(errors.length).toBeGreaterThan(0);
    expect(limitError?.constraints?.isPositive).toBeDefined();
    expect(limitError?.constraints?.isPositive).toBe(
      'limit must be a positive number',
    );
  });

  it('should validate page as non negative number', async () => {
    const dto = plainToClass(PaginationDto, { page: -1 });

    const errors = await validate(dto);
    const pageError = errors.find((error) => error.property === 'page');

    expect(errors.length).toBeGreaterThan(0);
    expect(pageError?.constraints?.isPositive).toBeDefined();
    expect(pageError?.constraints?.isPositive).toBe(
      'page must be a positive number',
    );
  });
});
