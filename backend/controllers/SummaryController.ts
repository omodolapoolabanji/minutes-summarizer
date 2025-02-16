import SummaryRepo from "../repositories/SummaryRepo";
import { Request, Response } from "express";
import TranscribeService from "../services/TranscribeService";

// this controller should work on summaries the user has saved 
class SummaryController{
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
    // get the audio data from the frontend : POST req
    async transcribeAudio(req: Request, res: Response){
        // the audio data gets sent and the transcription service that processes it
    }
     

    
}