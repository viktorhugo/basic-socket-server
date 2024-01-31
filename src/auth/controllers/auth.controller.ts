import { Body, Controller, Get, HttpException, HttpStatus, Post, Request } from '@nestjs/common';
import { Public } from 'src/meta/metadata';
import { LoginDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Public()
    @Post('login')
    async login(@Request() req, @Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto); 
    }

    @Public()
    @Get('renew')
    async renewToken(@Request() req: Request, @Body() loginDto: LoginDto) {
        const xToken: string = req.headers['x-token'];
        if (!xToken) throw new HttpException( { status: HttpStatus.BAD_REQUEST, error: 'missing token to renew!' }, 400 );
        return await this.authService.renewToken(xToken); 
    }

}
