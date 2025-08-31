import SummaryController from "../controllers/SummaryController";
import AuthenticationController from "../controllers/AuthenticationController";
import * as express from 'express'
import { Request, Response } from "express";
import multer from "multer";
import { verifyToken } from "../middleware/protectRoutes";
import { CustomRequest } from "../middleware/protectRoutes";

export default class AppRoutes{
    summaryController : SummaryController;
    authenticationController: AuthenticationController; 
    router : any; 
    upload : any;

    constructor(summaryController: SummaryController, authenticationController : AuthenticationController){
        this.summaryController = summaryController; 
        this.authenticationController = authenticationController; 
        this.router = express.Router(); 
        this.upload = multer({dest: 'backend/static/audio_data'});
        this.initAuthenticationRoutes() ;
        this.initSummaryRoutes();
        
   }

   initSummaryRoutes(){
    this.router.get('/summaries', verifyToken,async (req: CustomRequest, res: Response)=>{
        await this.summaryController.getUserSummaries(req, res); 
    }); 

    
    this.router.post('/summaries/transcribe',verifyToken,this.upload.single('file'), async(req: CustomRequest ,res: Response)=>{
        //specifies the file name in the field needs to be 'file'
        console.log(req.file);
        try{await this.summaryController.transcribeAudio(req, res); }   
        catch(error){
            console.error(error);
            return res.status(400).json({message: 'Error transcribing audio data!'})
        }}
        
        
    )
    
    this.router.get('/summaries/:id', verifyToken, async(req: CustomRequest, res: Response)=>{
        await this.summaryController.getSummaryById(req, res)
    })
   }

   initAuthenticationRoutes(){
    this.router.post('/auth/register', async(req: Request, res: Response)=>{
       await this.authenticationController.signup(req, res); 
    });
    this.router.post('/auth/login', async(req: Request, res: Response, next : any)=>{
        await this.authenticationController.login(req, res, next); 
    });
   
    this.router.post('/auth/unregister', async(req: Request, res: Response)=>{
        await this.authenticationController.unregister(req, res); 
    })
   }

   getRoutes():express.Router{
        return this.router; 
   }

}