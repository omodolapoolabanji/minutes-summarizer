import { compare, hash } from "bcryptjs";
import { User, IUser } from "../models/UserModel";
import jwt from  "jsonwebtoken"  
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Request } from "express";
export default class AuthService{
    constructor(){
        this.configurePassport(); 
    }

    async configurePassport(){
        passport.use(
            new LocalStrategy(async (username:string,password: string, done)=>{
               try{ const user = await User.findOne({username} )
                    if(!user || !await user.verifyPassword(password) ) {
                        return done(null, false, {message: 'Invalid Credentials!'})}
                    else return done(null, user)
                }
                catch(error){
                    console.error(error)
                    return done(error)
                }
})
        )
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

        if(secret) return  jwt.sign({username: user.username}, secret, {expiresIn: '1h'})
        else return null
    }


    
}