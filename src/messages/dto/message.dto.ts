import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}

export class RequestConversationMessageDto {
    @IsNotEmpty()
    readonly from: string;

    @IsNotEmpty()
    readonly to: string;

    @IsNotEmpty()
    readonly skip: number;

}
