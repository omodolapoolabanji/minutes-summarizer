import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request{
    userId?: string; 
}

export function verifyToken(req:Request, res:Response, next: NextFunction){
    const token = req.header("Authorization")
    if(!token){
        res.status(400).json("Something went wrong,login and try again")
    }else{
    try{
        const secret : string | undefined = process.env.TOKEN_SECRET || undefined
        if (secret){
            const decoded = jwt.verify(token,secret ) as {userId: string}
            (req as CustomRequest).userId = decoded?.userId
        }else{
            res.status(400).json("Something went wrong on our end!")
        }
        
    }catch(error:any){
        throw new Error("Something went wrong!")
    }}
    next()
}

