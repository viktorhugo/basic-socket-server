import { Body, Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { CreateUserDto, FindOneParams } from '../dto/user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly authService: UserService,
    ) {}

    @Post('new')
    async newUser(@Request() req, @Body() createUserDto: CreateUserDto) {
        return await this.authService.newUser(createUserDto);
    }

    @Delete('delete/:email')
    findOne(@Param() params: FindOneParams) {
        return 'This action returns a user';
    }
}
