export default class SummaryService{
    promptHeader : string; 
    promptBody : string; 
    url : string // the LLM's api url TODO: make this use the environment variable to change from prod to debug variables
    prompt: any; 
    model : string; 
    constructor(promptBody?: string, model?: string){
        this.promptBody = promptBody || "";  
        this.promptHeader = "summarize the following message into 200 words or less "; 
        this.url = "http://127.0.0.1:11434/api/generate" ; 
        this.prompt = {model: "", prompt: ''}; 
        this.model = model || "tinyllama"; 
    }
    constructPrompt():void{
        this.prompt = {model:`${this.model}`, prompt: `${this.promptHeader} - "${this.promptBody}"`, stream: false };
        console.log(this.prompt); 
    }
   
    async getSummaryFromModel(promptBody: string, model?: string) {
        try {
            this.promptBody = promptBody;
            this.model = model || this.model;
            this.constructPrompt();
    
            const response = await fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.prompt),
            });
    
            const rawText = await response.text();
            const data = JSON.parse(rawText).response;
            console.log("Parsed Response:", data);
            return data;
        } catch (error) {
            console.error("Error in getSummaryFromModel:", error);
        }
    }
}