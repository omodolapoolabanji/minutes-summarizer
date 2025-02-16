import { MongoClient, Db } from "mongodb";

const connectionString = process.env.ATLAS_URL || ""; 
const client = new MongoClient(connectionString); 
let connection : MongoClient; 
let db: Db| undefined; 
async function connectToDatabase():Promise<any>{
    try{
    connection = await client.connect(); 
    db = connection.db("Summarizer"); 
}catch(error){
    console.error(error)
}
}

connectToDatabase(); 
export default db; 