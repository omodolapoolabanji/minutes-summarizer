import SummaryRepo from "../repositories/SummaryRepo";
import UserRepo from "../repositories/UserRepo";
import {Request, Response} from 'express'; 

export default class AuthenticationController{
    //barebones naive implementation before actually enforcing encryption etc
    userRepo : UserRepo; 
    constructor(userRepo : UserRepo ){
        this.userRepo = userRepo; 
    }
    async login(req: Request, res: Response){

    }
    async signup(req: Request, res: Response){

    }
    
}