import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingSchema } from './meeting.schema';
import { UsersModule } from 'src/modules/users/users.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'meetings', schema: MeetingSchema }]),
    UsersModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService, MessageGateway],
  exports: [MeetingService],
})
export class MeetingModule {}
