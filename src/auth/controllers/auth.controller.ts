import { Body, Controller, Post, Request } from '@nestjs/common';
import { LoginDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    async login(@Request() req, @Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto); 
    }

}
