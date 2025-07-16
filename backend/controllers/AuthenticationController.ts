import SummaryRepo from "../repositories/SummaryRepo";
import UserRepo from "../repositories/UserRepo";
import {NextFunction, Request, Response} from 'express'; 
import AuthService from "../services/AuthenticationService";
import passport from "passport";
import { User } from "../models/UserModel";

export default class AuthenticationController{
    
    userRepo : UserRepo; 
    authenticationService: AuthService
    constructor(userRepo : UserRepo, authService : AuthService ){
        this.userRepo = userRepo; 
        this.authenticationService = authService
    }
    async login(req: Request, res: Response, next: any){
       try{ passport.authenticate("local", async (error: Error, user: any)=>{
            if (error) {next(error)}
            if (!user){ res.status(401).json({message: 'Invalid Credentials!'}) 
                return}
            res.status(200).json({token: await this.authenticationService.getTokens(user)})
        })(req, res, next)
        }
        catch(error){
            console.error(error)
        }
}
    async signup(req: Request, res: Response){
        try{
            const {username, password} = req.body
            this.authenticationService.register(username, password)
            res.status(200).json({message: "Registration successful!"})
        }catch(error){
            console.error(error)
            res.status(500).json({message: "Registration failed!"})
        }
    }
    //TODO create route
    async logout(req: Request, res : Response){
       try{ req.logOut(()=>{
            res.status(200).json({message : "logged out successfully!"})
        })}
        catch(error: any){
            throw new Error(error); 
        }
    }

    async unregister(){

    }
    
}