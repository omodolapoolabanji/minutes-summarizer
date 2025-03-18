import SummaryController from "../controllers/SummaryController";
import AuthenticationController from "../controllers/AuthenticationController";
import * as express from 'express'
import { Request, Response } from "express";
import multer from "multer";

export default class AppRoutes{
    summaryController : SummaryController;
    authenticationController: AuthenticationController; 
    router : any; 
    upload : any;

    constructor(summaryController: SummaryController, authenticationController : AuthenticationController){
        this.summaryController = summaryController; 
        this.authenticationController = authenticationController; 
        this.router = express.Router(); 
        this.upload = multer({dest: 'static/audio_data'});
        this.initAuthenticationRoutes() ;
        this.initSummaryRoutes();
        
   }

   initSummaryRoutes(){
    this.router.get('/summaries', async (req: Request, res: Response)=>{
        await this.summaryController.getUserSummaries(req, res); 
    }); 
    this.router.post('/summaries/transcribe',this.upload.single('file'), async(req: Request & { file: Express.Multer.File }, res: Response)=>{
        await this.summaryController.transcribeAudio(req, res); 
    })
    this.router.get('/summaries/test',   async (req: Request, res: Response)=>{ 
        await this.summaryController.testSummaryEndpoint(req, res); 
    })
    this.router.get('/summaries/:id', async(req: Request, res: Response)=>{
        await this.summaryController.getSummaryById(req, res)
    })
   }

   initAuthenticationRoutes(){
    this.router.post('/auth/register', async(req: Request, res: Response)=>{
       await this.authenticationController.signup(req, res); 
    });
    this.router.post('/auth/login', async(req: Request, res: Response)=>{
        await this.authenticationController.login(req, res); 
    });
   }

   getRoutes():express.Router{
        return this.router; 

   }

}