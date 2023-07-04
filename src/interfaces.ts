import { QueryResult } from "pg";

interface iMovieRequest {
    name: string;
    duration: number;
    price: number;
}
interface iMovie {
    name: string;
    description: string;
    duration: number;
    price: number;
    id: number;
}


type iMovieResult = QueryResult<iMovie>


export { iMovie, iMovieResult, iMovieRequest }