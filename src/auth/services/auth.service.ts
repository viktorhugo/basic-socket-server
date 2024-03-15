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
        // console.log(loginDto);
        
        const findUser = await this.userRepository.findOne({ email: loginDto.email });
        if (!findUser) throw new HttpException( { status: HttpStatus.BAD_REQUEST, error: 'User not exist!' }, 400 );

        const res = bcrypt.compareSync(loginDto.password, findUser.password);
        if (!res) throw new HttpException( { status: HttpStatus.BAD_REQUEST, error: 'Wrong password!' }, 400 );

        return await this.generateJWT(findUser.toJSON());
        
    }

    public async generateJWT( user ) {

        const payload = { uuid: user.uuid };
        const token = await this.jwtService.signAsync(payload)
        return {
            ok: true,
            user,
            token,
        };
    }

    public async renewToken( xToken: string ) {
        let verifyToken;
        try {
            verifyToken = await this.jwtService.verifyAsync(
                xToken, { secret: process.env.JWT_SECRET_KEY }
            );
            // console.log(verifyToken);
        } catch (error) {
            // console.log(error);
            throw new HttpException( { status: HttpStatus.UNAUTHORIZED, error: 'Wrong Token!' }, 401 );
        }
        const { uuid } = verifyToken;
        if (!uuid) throw new HttpException( { status: HttpStatus.UNAUTHORIZED, error: 'Wrong uuid!' }, 401 );
        const user = await this.userRepository.findOne({  _id : uuid });
        // console.log(user);
        return await this.generateJWT(user.toJSON());
    }

    public async verifyTokenAndSetOnline( xToken: string ) {
        let verifyToken;
        
        try {
            verifyToken = await this.jwtService.verifyAsync(
                xToken, { secret: process.env.JWT_SECRET_KEY }
            );
            // console.log(verifyToken);
        } catch (error) {
            // console.log(error);
            return null;
        }

        const { uuid } = verifyToken;
        if (!uuid) return false;
        const user: User = await this.userRepository.findOne({  _id : uuid });
        if (!user) return false;
        user.online = true;
        await this.userRepository.updateOne(user);
        return user;
    }

    public async disconnect(uuid: string) {
        const findUser: User = await this.userRepository.findOne({  _id : uuid });
        if (!findUser) return false;
        findUser.online = false;
        await this.userRepository.updateOne(findUser);
        return true;
    }

}
