import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { TMovies } from "./interfaces";
import { client } from "./database";

const checkName = async (
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
      messsage: "Movie not found",
    });
  }

  return next();
};

export { checkName };
