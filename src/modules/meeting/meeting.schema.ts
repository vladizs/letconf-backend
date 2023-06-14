import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/users/users.schema';

export type MeetingDocument = Meeting & Document;

@Schema()
export class Meeting {
  readonly _id = mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  readonly creator: User;

  @Prop({ required: true })
  readonly uuid: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  members: User[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
  connectedMembers: User[];

  @Prop({ required: true })
  readonly title: string;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
