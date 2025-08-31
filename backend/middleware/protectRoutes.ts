
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request{
    userId?: string; 
}


/**
 * Middleware function to verify the JSON Web Token (JWT) from the request headers.
 * If the token is valid, it extracts the user ID from the token and attaches it to the request object.
 * If the token is missing or invalid, it sends an appropriate error response.
 *
 * @param {Request} req - The request object from the Express framework.
 * @param {Response} res - The response object from the Express framework.
 * @param {NextFunction} next - The next middleware function in the Express stack.
 * 
 * @throws {Error} Throws an error if the token verification fails.
 */
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

