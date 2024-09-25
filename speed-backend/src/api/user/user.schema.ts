import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// This schema is used to define the structure of the user collection in MongoDB
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  uid: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  role: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);