import express,{ Express, Request, Response } from "express";
import './loadEnv.ts'
import AppRoutes from "./routes/AppRoutes.ts";
import SummaryController from "./controllers/SummaryController.ts";
import TranscribeService from "./services/TranscribeService.ts";
import SummaryRepo from "./repositories/SummaryRepo.ts";
import AuthenticationController from "./controllers/AuthenticationController.ts";
import UserRepo from "./repositories/UserRepo.ts";
 
// declare the app
const app : Express = express();
const port : Number = 3000;


app.use(express.json()); 

//add depenedencies
const summaryRepo : SummaryRepo = new SummaryRepo(); 
const userRepo:UserRepo = new UserRepo(); 
const transcribeService: TranscribeService = new TranscribeService(); 
const summaryController : SummaryController = new SummaryController(summaryRepo, transcribeService);
const authenticationController : AuthenticationController = new AuthenticationController(userRepo); 
const appRoutes : AppRoutes = new AppRoutes(summaryController,authenticationController ); 

const router : express.Router = appRoutes.getRoutes(); 
app.use('/api', router); 

app.listen(port, ()=>{
    //server startup message
    console.log(`Started the server on port ${port}`);
    //list the registered routes
    console.log(router.stack.map((r)=>r.route?.path));
}); 