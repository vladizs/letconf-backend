import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AppRoles } from '../app/app.roles';

export type UserDocument = User & Document;

@Schema()
export class User {
  readonly _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  readonly name: string;

  @Prop({ required: true, unique: true })
  readonly username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  readonly roles: AppRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
