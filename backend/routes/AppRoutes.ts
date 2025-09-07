import SummaryController from "../controllers/SummaryController";
import AuthenticationController from "../controllers/AuthenticationController";
import * as express from 'express'
import { Request, Response } from "express";
import multer from "multer";
import { verifyToken } from "../middleware/protectRoutes";
import { CustomRequest } from "../middleware/protectRoutes";
import expressWs from "express-ws";
import fs from "fs/promises"; 

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

    this.router.post('/summaries/add', verifyToken, async(req:CustomRequest, res: Response)=>{
        await this.summaryController.addToSummary(req, res); 
    })
    this.router.delete('/summaries/delete/:id',verifyToken, async(req: Request, res: Response)=>{
        await this.summaryController.deleteFromSummary(req, res); 
    })

    this.router.ws('/summaries/wsstream', verifyToken, (ws : any, req: any)=>{
        let buffer: Buffer[] = []; 
        ws.on("message", async (msg: Buffer | String)=>{

            if(typeof(msg) === "string"){
                if(msg==="END"){
                    console.log("Processing all read chunks.")
                    let finalBuffer = Buffer.concat(buffer); // concatenate all the audio chunks from the ws stream 
                    // need to do something with this. 
                    const filePath = `static/audio_data/audio_${Date.now()}.wav`; 
                    await fs.writeFile(filePath, finalBuffer); 
                    console.log("Wrote buffer to file"); 
                    const transcription = await this.summaryController.transcribeService.transcribeAudio(filePath);
                    const response  = await this.summaryController.summaryService.getSummaryFromModel(transcription); 
                    this.summaryController.transcribeService.cleanUp(); 
                    ws.send(response);
                }
                 
                
                else{
                    console.log(`Recieved message ${msg}`)
                }
            }else{
                // assume this is the audio binary chunk
                buffer.push(Buffer.from(msg))
            }

        })
        ws.on("close", ()=>{
            console.log("Client closed connection")
        })
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