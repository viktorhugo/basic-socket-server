import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Message, MessageSchema, User, UserSchema } from 'src/schemas/schemas';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature(
      [
        { name: Message.name, schema: MessageSchema },
        { name: User.name, schema: UserSchema },
      ]
    )
  ],
  controllers: [UserController],
  providers: [
    UserService,
  ],
  exports:[UserService]
})
export class UsersModule {}
