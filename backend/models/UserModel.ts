import {Schema, Model, model} from 'mongoose'
import { compare } from 'bcryptjs'
//interface for the user
export interface IUser extends Document{
    username: string,
    password: string, 
    verifyPassword(password:string) : Promise<boolean>; 

}

const userSchema = new Schema<IUser>(
    {username: {type: String, required: true, unique: true}, 
     password: {type: String, required: true}   }
)


userSchema.methods.verifyPassword = async function (password:string){
    return await compare(password, this.password)
}

export const User = model<IUser>('user', userSchema)