import UserModel from "../models/UserModel";
export default class UserRepo{
    users : Map<Number, UserModel>; 
    constructor(){
        this.users = new Map(); 
    }
    getUniqueId(): Number{
        return this.users.size + 1; 
    }
   
    addUser(user : UserModel): Number{
        try{const id : Number = this.getUniqueId() 
        user.id = id; 
        this.users.set(id, user)
        return id; }
        catch(error : any){
            console.error("something went wrong with adding a user!")
            return -1; 
        }
    }

    getUser(id : Number){
        try{
            return this.users.get(id)
        }catch(error: any){
            console.log("Error retreiving user by specified id")
            return -1; 
        }
    }

}