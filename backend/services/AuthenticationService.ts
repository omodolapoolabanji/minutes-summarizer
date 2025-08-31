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
        await newUser.save()
        return {message: "User successfully registered!", error:false}
            
    }
        catch(error: any){
            if (error.code === '11000') console.error('User already exists in database')
            return {message: 'Something went wrong registering the user!', error: false}
        }
    }

    async hash(password : string):Promise<String>{
        return await hash(password, 10)
    }
    
    async unregister(username: string, password: string) {
        try {
            const user  = await User.findOne({username: username})
            if(!user){
                console.error("User does not exist in the system!")
                return "Wrong credentials"; 
            }
            const valid = await compare(password, user.password)
            if(!valid){
                return "Wrong credentials"; 

            }
            const result = await User.deleteOne({_id:user._id});
            if (result.deletedCount === 0) {
                return ('No user found with the provided username and password.');
            }
            return "Successfully removed user!"
        } catch (error: any) {
            console.error('Could not delete user from database. Something went wrong at this time!', error);
        }
    }

    async getTokens(user :IUser){
        const secret : string | undefined = process.env.TOKEN_SECRET || undefined

        if(secret) return  jwt.sign({username: user.username, userId: user._id.toString()}, secret, {expiresIn: '1h'})
        else return null
    }


    
}
