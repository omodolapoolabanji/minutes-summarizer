import {NextFunction, Request, Response} from 'express'; 
import AuthService from "../services/AuthenticationService";
import passport from "passport";


export default class AuthenticationController{
    
    
    authenticationService: AuthService
    constructor( authService : AuthService ){
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
            const message = await this.authenticationService.register(username, password)
            if (!message.error){
                res.status(200).json({message: message.message})
            }
            else{
                res.status(500).json({message: message.message})
            }
            
        }catch(error){
            console.error(error)
            res.status(500).json({message: "Registration failed!"})
        }
    }
    
  
    
    async unregister(req:Request , res: Response){
        try{
            const {username, password} = req.body
            const message = await this.authenticationService.unregister(username, password); 
            res.status(200).json({message})
        }catch(error:any){
            res.status(500).json({message: "Unregister failed"})
        }
    }
    
}