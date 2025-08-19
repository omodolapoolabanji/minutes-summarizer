class PromptModel{
    // the prompt header might need to be a static header that gets used by every prompt
    promptHeader : string; 
    promptBody : string;
    constructor(promptHeader : string, promptBody : string){
        this.promptHeader = promptHeader; 
        this.promptBody =promptBody; 
    }
} 