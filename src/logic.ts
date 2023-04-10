import { Request, Response } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import { TMovies, TMoviesRequest } from "./interfaces";
import format from "pg-format";

const createMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const moviesData: TMoviesRequest = request.body;
  const queryString: string = format(
    `
    INSERT INTO
        movies
        (%I)
    VALUES
        (%L)
    RETURNING *;
    `,
    Object.keys(moviesData),
    Object.values(moviesData)
  );

  const queryResult: QueryResult<TMovies> = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};

const listMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryString: string = `
    SELECT 
      * 
    FROM
      movies;
    `;

  const queryResult: QueryResult<TMovies> = await client.query(queryString);

  return response.status(200).json(queryResult.rows);
};

const getMovieById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const queryString: string = `
      SELECT 
        * 
      FROM
        movies
      WHERE
        id = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const updateMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const movieData: Partial<TMoviesRequest> = request.body;
  const id: number = parseInt(request.params.id);
  const queryString: string = format(
    `
    UPDATE
      movies
      SET(%I) = ROW(%L)
    WHERE
      id = $1
    RETURNING *;
    `,
    Object.keys(movieData),
    Object.values(movieData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};

const deleteMovie = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const queryString: string = format(
    `
    DELETE FROM
      movies
    WHERE
      id = $1
    RETURNING *;
    `
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};

export { createMovies, listMovies, getMovieById, updateMovie, deleteMovie };
