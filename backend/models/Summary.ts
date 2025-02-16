export default class Summary{
    id: Number; 
    summaryHead : string;
    summaryBody : string; 
    constructor(id: Number, head: string, body : string){
        this.summaryHead = head ; 
        this.summaryBody = body; 
        this.id = id; 
    }
}