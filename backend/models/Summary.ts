import {Schema, model, Types, Document} from 'mongoose'

export interface ISummary extends Document {
    sumamaryHead: string, 
    summaryBody : string,
    userId : Types.ObjectId
}



const summarySchema = new Schema<ISummary>(
    {sumamaryHead: {type: String, },
     summaryBody: {type: String},
     userId: {type: Schema.Types.ObjectId, ref: "user", required: true}    
}
)

export const summaryModel = model<ISummary> ("summary",summarySchema)