import express,{ Express, Request, Response } from "express";
import './loadEnv.ts'
// declare the app
const app : Express = express();
const port : Number = 3000;


app.use(express.json()); 

//add depenedencies

app.listen(port, ()=>{console.log(`Started the server on port ${port}`)}); 


