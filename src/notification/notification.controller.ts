import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRoleEnum } from '../auth/constants/user-role.enum';
import { Auth } from '../auth/decorators';
import {
  BAD_REQUEST_EXAMPLE,
  DeleteResponseDto,
  ENTITY_NOT_FOUND_EXAMPLE,
  FORBIDDEN_EXAMPLE,
  PaginationDto,
  UNAUTHORIZED_EXAMPLE,
} from '../common';
import { Notification } from './entities';

@ApiTags('Notification')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Auth(UserRoleEnum.USER)
  @ApiOperation({ summary: 'Insert a new Notification' })
  @ApiResponse({
    status: 201,
    description: 'Returns the details of a notification process.',
    type: Notification,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BAD_REQUEST_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @Auth(UserRoleEnum.USER)
  @ApiOperation({
    summary: 'Retrieve a list of Notifications with optional pagination.',
  })
  @ApiResponse({ status: 200, description: 'Get Notifications' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: FORBIDDEN_EXAMPLE,
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.notificationService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(UserRoleEnum.USER)
  @ApiOperation({ summary: 'Find a Notification for ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of a Notification.',
    type: Notification,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    type: ENTITY_NOT_FOUND_EXAMPLE,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.findOne(id);
  }

  @Get('user/:id')
  @Auth(UserRoleEnum.USER)
  @ApiOperation({ summary: 'Find a Notification for User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of a Notifications associated to user',
    type: Notification,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    type: ENTITY_NOT_FOUND_EXAMPLE,
  })
  findNotificationsByUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.findNotificationsByUserId(id);
  }

  @Patch(':id/read/:status')
  @Auth(UserRoleEnum.USER)
  @ApiOperation({ summary: 'Update a read status for Notification' })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of a Updated Notification',
    type: Notification,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BAD_REQUEST_EXAMPLE,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UNAUTHORIZED_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: FORBIDDEN_EXAMPLE,
  })
  @ApiResponse({
    status: 404,
    description: 'NotFound',
    type: ENTITY_NOT_FOUND_EXAMPLE,
  })
  updateReadStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('status', ParseBoolPipe) status: boolean,
  ) {
    return this.notificationService.setReadStatus(id, status);
  }

  @Delete(':id')
  @Auth(UserRoleEnum.USER)
  @ApiOperation({ summary: 'Delete a Notification ' })
  @ApiResponse({
    status: 200,
    description: 'Delete Notification Successfully',
    type: DeleteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Notification Not Found',
    type: ENTITY_NOT_FOUND_EXAMPLE,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
    type: BAD_REQUEST_EXAMPLE,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: FORBIDDEN_EXAMPLE,
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.remove(id);
  }
}
