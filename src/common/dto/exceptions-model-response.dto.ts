import { ApiProperty } from '@nestjs/swagger';

export class ENTITY_NOT_FOUND_EXAMPLE {
  @ApiProperty({
    example:
      'The entity with the id c589e948-fb91-475c-9043-1b4c05bec680 not found',
    description: 'ENTITY_NOT_FOUND',
  })
  message: string;

  @ApiProperty({
    example: 'The entity not found.',
    description: 'The error message',
  })
  reference: string;
}

export class UNAUTHORIZED_EXAMPLE {
  @ApiProperty({ example: 401, description: 'The status code' })
  code: number;

  @ApiProperty({
    example: '2024-12-22T23:00:00Z',
    description: 'The timestamp',
  })
  timestamp: Date;

  @ApiProperty({ example: '/api/auth/login' })
  path: string;

  @ApiProperty({ example: 'POST', description: 'The http method' })
  method: string;

  @ApiProperty({
    example: 'You are not authorized to perform this action.',
    description: 'The error message',
  })
  message: string;
}

export class BAD_REQUEST_EXAMPLE {
  @ApiProperty({
    example: '2024-12-22T23:00:00Z',
    description: 'The timestamp',
  })
  timestamp: Date;

  @ApiProperty({ example: 400, description: 'The status code' })
  status: number;

  @ApiProperty({ example: 'Bad Request', description: 'The error message' })
  error: string;

  @ApiProperty({
    example: 'Invalid input data provided.',
    description: 'The error message',
  })
  message: string;

  @ApiProperty({
    example: [
      {
        field: 'name',
        message: 'name must be a string.',
      },
    ],
    description: 'The field errors',
  })
  fieldErrors: [];
}

export class BAD_REQUEST_BY_MONGOID_EXAMPLE {
  @ApiProperty({ example: 400, description: 'The status code' })
  status: number;

  @ApiProperty({ example: 'Bad Request', description: 'The error message' })
  error: string;

  @ApiProperty({
    example: 'Invalid MongoId',
    description: 'The error message',
  })
  message: string;
}

export class FORBIDDEN_EXAMPLE {
  @ApiProperty({
    example: 'User John need a valid role: [USER,ADMIN]',
    description: 'Detailed message explaining why the user is forbidden',
  })
  message: string;

  @ApiProperty({
    example: 'Forbidden',
    description: 'Short error type or keyword',
  })
  error: string;

  @ApiProperty({
    example: 403,
    description: 'HTTP status code indicating forbidden access',
  })
  statusCode: number;
}
