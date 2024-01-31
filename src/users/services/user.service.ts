import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from '../dto/user.dto';
const bcrypt = require('bcryptjs');

@Injectable()
export class UserService {

    public saltOrRounds = 10;

    constructor(
        @InjectModel(User.name)
        private readonly userRepository: Model<User>,
        private readonly authService: AuthService,
    ) {}

    public async newUser(createUserDto: CreateUserDto): Promise<any> {
        const {email} = createUserDto;
        const findUser = await this.userRepository.findOne( { email })
        if (findUser) throw new HttpException( { status: HttpStatus.BAD_REQUEST, error: 'Email already exist!' }, 400 );
        ///*  encrypt password
        const salt = bcrypt.genSaltSync(this.saltOrRounds);
        const hash = bcrypt.hashSync(createUserDto.password, salt);
        createUserDto.password = hash;
        try {
            ///* insert new user
            const newUser = await this.userRepository.create(createUserDto);
            ///* get JWT
            return await this.authService.generateJWT(newUser.toJSON());
        } catch (error) {
            console.log(error);
            throw new HttpException( { status: HttpStatus.INTERNAL_SERVER_ERROR, error }, 500);
        }
    }

    public async findUser (email: string) {
        const findUser = await this.userRepository.findOne( { email });
        return findUser;
    }
}
