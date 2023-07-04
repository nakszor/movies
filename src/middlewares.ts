import { NextFunction, Request, Response,  } from "express";
import { QueryConfig } from "pg";
import { database } from "./database";
import { iMovieResult } from "./interfaces";


const ensureMovieExistsByName = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> =>{

    const name: string = request.body.name

    const queryString: string = `
            SELECT
                *
            FROM
                movies
            WHERE
                name = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [name]
    }

    const queryResult: iMovieResult = await database.query(queryConfig)
   
        if(queryResult.rowCount){
            return response.status(409).json({
                message: "Movie already exists."
            })
        }

    return next() 

}
const ensureMovieExistsByID = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> =>{
    const id: string = request.params.id

    const queryString: string = `
            SELECT
                *
            FROM
                movies
            WHERE
                id = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: iMovieResult = await database.query(queryConfig)
    
        if(!queryResult.rowCount){
            return response.status(409).json(  {
                "message": "Movie not found."
              })
        }

    return next()
}

export {ensureMovieExistsByID,ensureMovieExistsByName}