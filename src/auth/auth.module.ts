import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    AuthService,
  ],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
