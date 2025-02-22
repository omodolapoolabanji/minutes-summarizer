import SummaryRepo from "../repositories/SummaryRepo";
import { Request, Response } from "express";
import TranscribeService from "../services/TranscribeService";
import fs from "fs";

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

    async getSummaryById(req: Request, res: Response){

    }
    
    // get the audio data from the frontend : POST req
    async transcribeAudio(req: Request & { file: Express.Multer.File }, res: Response){
        // the audio data gets sent and the transcription service that processes it
        // call the service to handle to upload and transcription
        await this.transcribeService.storeAudioData(req.file);
        const fileName = req.file.originalname;
        //call the transcription service to handle the audio data
        const transcription = await this.transcribeService.transcribeAudio(fileName);
        return res.json({transcription: transcription});
    }
     

    
}