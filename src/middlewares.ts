import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { TMovies, TMoviesRequest } from "./interfaces";
import { client } from "./database";

const checkId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
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

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      error: "Movie not found!",
    });
  }

  return next();
};

const checkName = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name: string = request.body.name;
  const queryString: string = `
      SELECT 
        * 
      FROM
        movies
      WHERE
        name = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult<TMovies> = await client.query(queryConfig);

  if (queryResult.rowCount !== 0 ) {
    return response.status(409).json({
      error: "Movie name already exists!",
    });
  }

  return next();
};

export { checkId, checkName };
