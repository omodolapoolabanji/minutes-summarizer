import * as vosk from 'vosk'
import * as fs from 'fs'
import {spawn} from 'child_process'



export default class TranscribeService{
    MODEL_PATH : string = "";
    FILE_NAME: string = "";
    SAMPLE_RATE : number;
    BUFFER_SIZE : number;
    MODEL_NAME: string = "vosk-small-model"; 
    model: any; 

    constructor(fileName ?: string, sampleRate: number = 16000, bufferSize : number = 4000){
        this.MODEL_PATH = `../resources/models/${this.MODEL_NAME}`;
        this.FILE_NAME = '../static/audio_data' + fileName; 
        this.SAMPLE_RATE = sampleRate; 
        this.BUFFER_SIZE = bufferSize; 
        vosk.setLogLevel(0); 
    }

    initModel():void{
        this.model = new vosk.Model(this.MODEL_PATH); 
    }

    async transcribeAudio(fileName?:string):Promise<string>{
        //checks for whether the object has any of the model or file properties defined
        if (!fileName && !this.FILE_NAME){
            console.error("No audio file specified to transcribe!"); 
        }
        if(!this.MODEL_PATH){
            console.error("No vosk models specified for transcription handling!")
        }
        else if(fileName){
            this.FILE_NAME = fileName
        }
        //checks for whether the specified model/filename exist in the resource directory
        if(!fs.existsSync(this.FILE_NAME) || !fs.existsSync(this.MODEL_PATH)){
            console.error('Resource or data needed for transcription not specified!'); 
        }
        this.initModel(); 
        const rec = new vosk.Recognizer({model: this.model, sampleRate: this.SAMPLE_RATE});
        return new Promise( (resolve, reject)=>{
            const ffmpeg_run = spawn('ffmpeg', ['-loglevel', 'quiet', '-i', this.FILE_NAME,
                            '-ar', String(this.SAMPLE_RATE) , '-ac', '1',
                            '-f', 's16le', '-bufsize', String(this.BUFFER_SIZE) , '-']);

            var finalResult: string = ""; 
            ffmpeg_run.stdout.on('data', (stdout) => {
                if (rec.acceptWaveform(stdout))
                    finalResult+=  rec.result().text + ' ';
                else
                    console.log(rec.partialResult())
               
            }); 

            ffmpeg_run.on('close', ()=>{
                finalResult += rec.finalResult().text; 
                resolve(finalResult);
            })

            ffmpeg_run.on('error', (error) => {
                reject({error: error}); 
            })
        })
        

    }

    async storeAudioData(file: Express.Multer.File):Promise<string>{
        // store the audio data in the static directory
        const fileName = file.originalname; 
        const filePath = `../static/audio_data/${fileName}`; 
        // check whether file is wav
        if(file.mimetype !== 'audio/wav'){
            throw new Error('File is not a wav file!'); 
        }
        fs.writeFileSync(filePath, file.buffer); 
        return fileName; 

    }
    

    
}