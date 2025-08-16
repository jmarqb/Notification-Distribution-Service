import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../constants/user-role.enum';

@Schema()
export class User {
  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec680',
    description: 'The user id',
  })
  @Prop({ required: true, type: String })
  _id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Defining the user firstName',
    type: String,
  })
  @Prop({ index: true, required: true })
  firstName: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Defining the user lastName',
    type: String,
  })
  @Prop({ index: true, required: true })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  fullName: string;

  @ApiProperty({
    example: 'jonhdoe@gmail.com',
    description: 'Defining the user email',
    type: String,
  })
  @Prop({ type: String, index: true, required: true, unique: true })
  email: string;

  @ApiProperty({
    example: '+53555558888',
    description: 'Defining the user phone',
    type: String,
  })
  @Prop({ type: String, index: true, required: false })
  phone?: string;

  @ApiProperty({
    example: 'frf3234fhyfgfg/34343ytty34t',
    description: 'Defining the user password',
    type: String,
  })
  @Prop({ type: String, index: true, required: true })
  password: string;

  @ApiProperty({
    example: '[ROLE1,ROLE2]',
    description: 'Defining the user role',
    enum: Object.values(UserRoleEnum),
  })
  @Prop([
    {
      index: true,
      required: true,
      type: String,
      enum: Object.values(UserRoleEnum),
    },
  ])
  roles: string[];

  @ApiProperty()
  @Prop({ index: true, type: Boolean, required: false, default: false })
  deleted: boolean;

  @ApiProperty()
  @Prop({ index: true, type: Date, required: false })
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('versionKey', false);
UserSchema.set('timestamps', true);
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
