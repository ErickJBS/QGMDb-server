import * as express from "express";
import oracledb from "oracledb";
import { environment } from "../enviroments/enviroment";
import { Movie } from "../models/movie";

class MovieController {
  public detailsPath = "/movie/details";
  public peoplePath = "/movie/people";
  public genresPath = "/movie/genres";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.detailsPath, this.getMovieDetails);
    this.router.get(this.peoplePath, this.getMoviePeople);
    this.router.get(this.genresPath, this.getMovieGenres);
  }

  public async getMovieDetails(request: express.Request, response: express.Response) {
    let connection;
    try {
      const id = request.query.id;
      connection = await oracledb.getConnection(environment.databaseConfig);
      const result = await connection.execute(
        `SELECT movie_id, movie_title, duration,
          release_date, abstract, cover
        FROM movies WHERE movie_id = :id`, [id]
      );
      const movie = result.rows[0] as any;
      const tmp = new Movie(movie[0], movie[1], movie[2], movie[3], movie[4], movie[5]);
      response.json(tmp);
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log("Something went wrong!", error);
    } finally {
      if (connection) {
        // conn assignment worked, need to close
        await connection.close();
      }
    }
  }

  public async getMoviePeople(request: express.Request, response: express.Response) {
    let connection;
    try {
      const id = request.query.id;
      connection = await oracledb.getConnection(environment.databaseConfig);
      let result = await connection.execute(
        `SELECT (p.first_name || ' ' ||p.last_name) AS name
        FROM people p JOIN movie_people mp
        ON mp.person_id = p.person_id
        WHERE mp.role_id = 11 AND mp.movie_id = :id`, [id]
      );
      const directors = result.rows.map((item) => {
        return (item as any)[0];
      });
      result = await connection.execute(
        `SELECT (p.first_name || ' ' ||p.last_name) AS name
        FROM people p JOIN movie_people mp
        ON mp.person_id = p.person_id
        WHERE mp.role_id = 22 AND mp.movie_id = :id`, [id]
      );
      const actors = result.rows.map((item) => {
        return (item as any)[0];
      });

      response.json({ directors, actors });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log("Something went wrong!", error);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }

  public async getMovieGenres(request: express.Request, response: express.Response) {
    let connection;
    try {
      const id = request.query.id;
      connection = await oracledb.getConnection(environment.databaseConfig);
      const result = await connection.execute(
        `SELECT g.genre_description
        FROM genres g
        JOIN movie_genres mg
        ON g.genre_id = mg.genre_id
        WHERE mg.movie_id = :id`, [id]
      );
      const tmp = result.rows.map((item) => {
        return (item as any)[0];
      });
      response.json(tmp);
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log("Something went wrong!", error);
    } finally {
      if (connection) {
        // conn assignment worked, need to close
        await connection.close();
      }
    }
  }

}

export default new MovieController();
