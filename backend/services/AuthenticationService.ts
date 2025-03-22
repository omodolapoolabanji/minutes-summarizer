import { compare, hash } from "bcryptjs";
import { User, IUser } from "../models/UserModel";
import jwt from  "jsonwebtoken"  
export default class AuthService{
    constructor(){

    }

    async register(username: string, password : string){
        try{const hashedPassword : string = await hash(password, 10); 
        const newUser = new User({username: username, password: hashedPassword}); 
        newUser.save()}
        catch(error: any){
            if (error.code === '11000') throw new Error('User already exists in database')
            else throw new Error('Something went wrong registering the user!')
        }
    }

    async getTokens(user :IUser){
        const secret : string | undefined = process.env.TOKEN_SECRET || undefined
        if(secret) return  jwt.sign({username: user.username}, secret, {})
        else return null
    }

    

    
}