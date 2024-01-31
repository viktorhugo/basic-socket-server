import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true})
    name: string;

    @Prop({ required: true, unique: true})
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, default: false })
    online: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.method('toJSON', function() {
    const { _id, password, __v, ...object} = this.toObject() as any;
    object.uuid = _id;
    return object
})