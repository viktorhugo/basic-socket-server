import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { LoginDto } from '../dto/auth.dto';
var bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name)
        private readonly userRepository: Model<User>,
    ) {}

    public async login(loginDto: LoginDto) {
        console.log(loginDto);
        
        const findUser = await this.userRepository.findOne({ email: loginDto.email });
        if (!findUser) throw new HttpException( { status: HttpStatus.BAD_REQUEST, error: 'User not exist!' }, 400 );

        const res = bcrypt.compareSync(loginDto.password, findUser.password);
        if (!res) throw new HttpException( { status: HttpStatus.BAD_REQUEST, error: 'Wrong password!' }, 400 );

        return await this.generateJWT(findUser.toJSON());
        
    }

    public async generateJWT( user ) {
        const payload = { sub: user._id, email: user.email };
        const token = await this.jwtService.signAsync(payload)
        return {
            ok: true,
            user,
            token,
        };
    }

}
