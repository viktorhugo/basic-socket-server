import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true})
export class Message {
    
    @Prop({ required: true, type: Types.ObjectId, ref: 'User'})
    from: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User'})
    to: Types.ObjectId;

    @Prop({ required: true })
    message: string;

}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.method('toJSON', function() {
    const { _id, __v, ...object} = this.toObject() as any;
    object.uuid = _id;
    return object
})