import {Schema, model} from 'mongoose'
import { compare } from 'bcryptjs'
import { ObjectId } from 'mongodb';
//interface for the user
export interface IUser extends Document{
    _id: ObjectId,
    username: string,
    password: string, 
    
    verifyPassword(password:string) : Promise<boolean>; 

}

const userSchema = new Schema<IUser>(
    {username: {type: String, required: true, unique: true}, 
     password: {type: String, required: true},   }
)


userSchema.methods.verifyPassword = async function (password:string){
    return await compare(password, this.password)
}

export const User = model<IUser>("user", userSchema)