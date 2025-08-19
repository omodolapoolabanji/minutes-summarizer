import { compare, hash } from "bcryptjs";
import { User, IUser } from "../models/User";
import jwt from  "jsonwebtoken"  
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

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
                }}))}

    async register(username: string, password : string){
        try{ 
        const newUser = new User({username: username, password: await this.hash(password)}); 
        newUser.save()}
        catch(error: any){
            if (error.code === '11000') throw new Error('User already exists in database')
            else throw new Error('Something went wrong registering the user!')
        }
    }

    async hash(password : string):Promise<String>{
        return await hash(password, 10)
    }
    
    async unregister(username: string, password: string) {
        try {
            const result = await User.deleteOne({ username: username, password: await this.hash(password) });
            if (result.deletedCount === 0) {
                throw new Error('No user found with the provided username and password.');
            }
        } catch (error: any) {
            throw new Error('Could not delete user from database. Something went wrong at this time!');
        }
    }

    async getTokens(user :IUser){
        const secret : string | undefined = process.env.TOKEN_SECRET || undefined

        if(secret) return  jwt.sign({username: user.username, userId: user._id.toString()}, secret, {expiresIn: '1h'})
        else return null
    }


    
}