import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/modules/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { MeetingDocument } from './meeting.schema';
import { UserModel } from '../users/users.schema';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel('meetings')
    private readonly meetingModel: Model<MeetingDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async createMeeting(creatorUsername: string) {
    const user = await this.usersService.getByUsername(creatorUsername);
    const uuid = uuidv4();

    const meeting = new this.meetingModel({
      title: `New meeting ${uuid.slice(0, 8)}`,
      creator: user.id,
      uuid,
      members: [user.id],
      connectedMembers: [],
    });

    const meetingData = await meeting.save();

    return {
      uuid: meetingData.uuid,
    };
  }

  async getMeetingsByUser(username: string) {
    const user = await this.usersService.getByUsername(username);
    const meetings = await this.meetingModel.find({ members: user._id });

    console.log(meetings);

    return meetings;
  }

  async getMeetingById(id: string) {
    const meeting = await this.meetingModel.findOne({ uuid: id });
    return meeting;
  }
}
