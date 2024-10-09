import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Roles:
 * Analyst: Can view and analyse all articles
 * Moderator: Can view and moderate articles
 * Submitter: Can submit articles
 */

// This schema is used to define the structure of the user collection in MongoDB
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  uid: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: true })
  role: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
