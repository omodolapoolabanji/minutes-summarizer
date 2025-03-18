import Summary from "../models/Summary";

export default class SummaryRepo{
    summaries : Map<Number, Summary>
    constructor(){
        this.summaries = new Map(); 
    }

    addSummary(summary: Summary){
        this.summaries.set(summary.id, summary);
    }

    getSummaryById(id: Number){
        try{
            return this.summaries.get(id); 
        }catch(error: any){
            console.error("Error retrieving summary by id", error);
        }
    }

    getAllSummaries(): Array<Summary>{
        return Array.from(this.summaries.values());
    }

  
}