import { Request, Response } from "express";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import { TMovies, TMoviesRequest } from "./interfaces";

const createMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const moviesData: TMoviesRequest = request.body;

  const queryString: string = `
    INSERT INTO
        movies
        ("name","category", "duration", "price")
    VALUES
        ($1, $2, $3, $4)
    RETURNING *;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: Object.values(moviesData),
  };

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

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

export { createMovies, listMovies, getMovieById };
