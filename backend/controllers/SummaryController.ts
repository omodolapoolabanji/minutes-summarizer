import { Request, Response } from "express";
import { CustomRequest } from "../middleware/protectRoutes";
import TranscribeService from "../services/TranscribeService";
import SummaryService from "../services/SummaryService";
import { ISummary, summaryModel } from "../models/Summary";
import { User } from "../models/User";
import mongoose from "mongoose";

// this controller should work on summaries the user has saved 
export default class SummaryController{
    transcribeService :TranscribeService; 
    summaryService : SummaryService;
    constructor( transcribeService : TranscribeService, summaryService : SummaryService){
        this.transcribeService = transcribeService; 
        this.summaryService = summaryService; 
    }
    // serves the frontend user summaries
    async getUserSummaries(req : CustomRequest, res : Response){
      try {
        const summaries = await this.summaryService.findAllSummaries(req.userId)
        res.json(summaries)
    }
      catch(error){
        res.status(400).json({message: 'Error returning summaries'})
        console.error(error)
      }
    }
    
    
    async getSummaryById(req: CustomRequest, res: Response){
        try{
            const summaryId = req.params.id
            const summary = await this.summaryService.findSummaryById(summaryId);
            res.json(summary);
        }
        catch(error){
            res.status(400).json({message: "Error returning summary by Id"});
        }
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
        const response  = await this.summaryService.getSummaryFromModel(transcription); 
        this.transcribeService.cleanUp(); 
        return res.json({summary: response});}
        catch(error){
            console.error(error);
            return res.status(400).json({message: 'Error transcribing audio data!'})
        }
    }
   
    // User might decide to save the summary and we need to add it to the database when this happens
    async addToSummary(req: CustomRequest, res: Response){
        //validate the userId first
        if(!req.userId|| !mongoose.Types.ObjectId.isValid(req.userId)){
            return res.status(400).json("User is not valid!");
        }
        const summary = new summaryModel({
            summaryHead: req.body.summaryHead,
            summaryBody: req.body.summaryBody,
            userId: new mongoose.Types.ObjectId(req.userId)});
        const summaryId = await this.summaryService.addSummarytoDB(summary);
        res.status(201).json({ message: 'Summary added successfully!' , summaryId});
    }
    //Delete from the Database 
    async deleteFromSummary(req: Request, res: Response){
        try{
            await this.summaryService.deleteSummary(req.params.id);
            return res.status(200).json("Deleted Summary! ");}
        catch(error){
            return res.status(400).json("Delete Summary failed!")
        }
       

    }
    
     

    
}