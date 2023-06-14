import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AccessControlModule } from 'nest-access-control';
import { roles } from './app.roles';
import { MeetingModule } from '../meeting/meeting.module';
import { MessageGateway } from '../meeting/message.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AccessControlModule.forRoles(roles),
    AuthModule,
    UsersModule,
    MeetingModule,
  ],
  controllers: [AppController],
  providers: [AppService, MessageGateway],
})
export class AppModule {
  constructor() {
    console.log(roles);
  }
}
