import { Body, Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { Public } from 'src/meta/metadata';
import { CreateUserDto, FindOneParams } from '../dto/user.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {

    constructor(
        private readonly usersService: UserService,
    ) {}

    @Public()
    @Post('register')
    async newUser(@Request() req, @Body() createUserDto: CreateUserDto) {
        return await this.usersService.newUser(createUserDto);
    }

    // already AuthGuard
    @Delete('delete/:email')
    findOne(@Param() params: FindOneParams) {
        return 'This action returns a user';
    }

    // already AuthGuard
    @Get('all-users')
    public async getAllUsers(@Request() req) {
        return await this.usersService.getAllUsers();
    }

    // already AuthGuard
    @Get('check-token')
    public async checkToken(@Request() req) {
        return {
            ok: true,
            msg: "validate"
        };
    }

}
