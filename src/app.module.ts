import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { EventsModule } from './global/web-socket/events.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@clustervm.kpxmetd.mongodb.net/${process.env.DB_NAME}`),
    EventsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
