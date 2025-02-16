import SummaryRepo from "../repositories/SummaryRepo";
import UserRepo from "../repositories/UserRepo";

class AuthenticationController{
    //barebones naive implementation before actually enforcing encryption etc
    userRepo : UserRepo; 
    constructor(userRepo : UserRepo ){
        this.userRepo = userRepo; 
    }
    async login(){

    }
    async signup(){

    }
    
}