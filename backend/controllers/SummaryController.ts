import SummaryRepo from "../repositories/SummaryRepo";
import { Request, Response } from "express";
import TranscribeService from "../services/TranscribeService";
import fs from "fs";

// this controller should work on summaries the user has saved 
export default class SummaryController{
    summaryRepo : SummaryRepo; 
    transcribeService :TranscribeService; 
    constructor(summaryRepo : SummaryRepo, transcribeService : TranscribeService){
        this.summaryRepo = summaryRepo; 
        this.transcribeService = transcribeService; 
    }
    // serves the frontend user summaries
    async getUserSummaries(req : Request, res : Response){
        try{
            return res.json(this.summaryRepo.getAllSummaries())
        }catch(error){
            return res.status(400).json({message: 'Error returning all summries!'})
        }
    }

    async getSummaryById(req: Request, res: Response){

    }
    
    // get the audio data from the frontend : POST req
    async transcribeAudio(req: Request , res: Response){
        // the audio data gets sent and the transcription service that processes it
        // call the service to handle to upload and transcription
       try{
        if(!req.file){
            return res.status(400).json({message: 'No audio data uploaded!'})
        }
        
        const fileName = req.file.filename;
        //call the transcription service to handle the audio data
        const transcription = await this.transcribeService.transcribeAudio(fileName);
        this.transcribeService.cleanUp(); 
        return res.json({transcription: transcription});}
        catch(error){
            console.error(error);
            return res.status(400).json({message: 'Error transcribing audio data!'})
        }
    }
    async testSummaryEndpoint(req: Request, res: Response){
        try{
            return res.send("This endpoint works I guess[?]"); }
        catch(error){
            return res.status(400).json({message:"there was an error trying to recieve test message from the server"}); 
        }
    }
     

    
}