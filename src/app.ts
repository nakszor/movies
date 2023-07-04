import express from 'express'
import { startDatabase } from './database';
import { createMovie, deleteMovie, updateMovie, listMovies } from './functions';
import { ensureMovieExistsByID, ensureMovieExistsByName } from './middlewares';


const app = express();
app.use(express.json());

app.get("/movies", listMovies) 
app.post("/movies", ensureMovieExistsByName,createMovie)
app.delete("/movies/:id", ensureMovieExistsByID, deleteMovie)
app.patch("/movies/:id", ensureMovieExistsByID, ensureMovieExistsByName, updateMovie)

app.listen(3000, async () => {
    await startDatabase();
    console.log('Server on!')
})