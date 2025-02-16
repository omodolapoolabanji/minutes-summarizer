export default class UserModel{
    id: Number; 
    username : string;
    password: string;
    summaries : Array<string>;   
    constructor(id: Number, username: string, password : string, summaries : Array<string> ){
        // after completing the repo initialization, we need to work on the id
        this.id = id; 
        this.username = username; 
        this.password = password; 
        this.summaries = []; 
    }
}

 