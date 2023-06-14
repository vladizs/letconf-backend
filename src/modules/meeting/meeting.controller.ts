import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@ApiTags('Meeting')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post('/create')
  async createMeeting(@Request() req: any) {
    return this.meetingService.createMeeting(req.user.username);
  }

  @Get('/list')
  async getMeetings(@Request() req: any) {
    return this.meetingService.getMeetingsByUser(req.user.username);
  }

  @Get('/s/:id')
  async getMeting(@Param('id') id: string) {
    return this.meetingService.getMeetingById(id);
  }
}
