import { Request, Response } from "express";
import { database } from "./database";
import { QueryConfig } from 'pg'

import { iMovieRequest, iMovieResult } from "./interfaces";

const listMovies = async (request: Request, response: Response): Promise<Response> => {
   
    let page: number = Number(request.query.page) || 1;
    let perPage: number = Number(request.query.perPage) || 5;
    
    if (page < 1 || isNaN(page)) {
      page = 1;
    }
    
    if (perPage < 1 || isNaN(perPage) || perPage > 5) {
      perPage = 5;
    }
    
    let sort: any = request.query.sort;
    let order: any = request.query.order;
    
    let orderBy: string = '';
    
    if (sort === 'price') {
      orderBy = 'ORDER BY price';
    } else if (sort === 'duration') {
      orderBy = 'ORDER BY duration';
    }
    
    if (order === 'desc') {
      orderBy += ' DESC';
    } else if (sort) {
      orderBy += ' ASC';
    }
    
    const queryString: string = `
      SELECT 
          *
      FROM
          Movies
      ${orderBy}
      OFFSET 
          ${(page - 1) * perPage}
      LIMIT 
          ${perPage};
    `;
    
    const queryResult: iMovieResult = await database.query(queryString);
    
    let previousPage: string | null = null;
    let nextPage: string | null = null;
    
    if (page > 1) {
      previousPage = `http://localhost:3000/movies?page=${page - 1}&perPage=${perPage}&sort=${sort || ''}&order=${order || ''}`;
    }
    
    if (queryResult.rows.length === perPage) {
      nextPage = `http://localhost:3000/movies?page=${page + 1}&perPage=${perPage}&sort=${sort || ''}&order=${order || ''}`;
    }
    
    const result = {
      previousPage,
      nextPage,
      count: queryResult.rows.length,
      data: queryResult.rows
    };
    
    return response.status(200).json(result);
  };
  
const createMovie = async (request:Request, response: Response): Promise<Response> => {
   
    const newMovie: iMovieRequest = request.body

    const queryString: string = `
        INSERT INTO 
            Movies(name, duration, price)
        VALUES 
            ($1, $2, $3)
        RETURNING *;
        `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: Object.values(newMovie) 
    }

    const queryResult: iMovieResult = await database.query(queryConfig)

    return response.status(201).json(queryResult.rows[0])
}

const deleteMovie = async (request:Request, response: Response): Promise<Response> => {
   
    const id: number = parseInt(request.params.id)
    
    const queryString: string = `
        DELETE FROM
            movies
        WHERE
            id = $1;    
    
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    await database.query(queryConfig)
    
    return response.status(204).send()
}

const updateMovie = async (request:Request, response: Response) =>{

    const id: number = parseInt(request.params.id)

    const movieData = Object.values(request.body)

    const queryString: string = `
        UPDATE
            movies
        SET
            name = $1,
            duration = $2,
            description= $3,
            price = $4
        WHERE
            id = $5
        RETURNING *;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [...movieData, id]
    }
    
    const queryResult: iMovieResult = await database.query(queryConfig)
   
    return response.status(201).json(queryResult.rows[0])
}

export {listMovies, createMovie, deleteMovie, updateMovie}