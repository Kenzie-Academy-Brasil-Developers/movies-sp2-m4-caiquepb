import express, { Application, json } from "express";
import { startDatabase } from "./database";
import {
  createMovies,
  deleteMovie,
  getMovieById,
  listMovies,
  updateMovie,
} from "./logic";
import { checkId, checkName } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/movies", checkName, createMovies);
app.get("/movies", listMovies);
app.get("/movies/:id", checkId, getMovieById);
app.patch("/movies/:id", checkId, checkName, updateMovie);
app.delete("/movies/:id", checkId, deleteMovie);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server started on port 3000");
});
