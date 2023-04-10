import express, { Application, json } from "express";
import { startDatabase } from "./database";
import {
  createMovies,
  deleteMovie,
  getMovieById,
  listMovies,
  updateMovie,
} from "./logic";
import { checkName } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/movies", createMovies);
app.get("/movies", listMovies);
app.get("/movies/:id", checkName, getMovieById);
app.patch("/movies/:id", checkName, updateMovie);
app.delete("/movies/:id", checkName, deleteMovie);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server started on port 3000");
});
