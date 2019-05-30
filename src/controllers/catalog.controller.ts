import * as express from "express";
import oracledb from "oracledb";
import { environment } from "../enviroments/enviroment";
import { Movie } from "../models/movie";

class DatabaseController {
  public path = "/catalog";
  public sizePath = "/length";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getCatalog);
    this.router.get(this.sizePath, this.getSize);
  }

  public async getCatalog(request: express.Request, response: express.Response) {
    let connection;
    try {
      const lower = request.query.lower;
      const upper = request.query.upper;
      connection = await oracledb.getConnection(environment.databaseConfig);
      const result = await connection.execute(
        `SELECT * FROM (
            SELECT movie_id, movie_title, duration, release_date, abstract, cover,
            row_number() over (order by movie_title) r
            FROM movies ORDER BY movie_title
        )
        WHERE r BETWEEN :lower AND :upper`, [lower, upper]
      );
      const rows: Movie[] = [];
      for (const m of result.rows) {
        const movie = m as any;
        const tmp = new Movie(movie[0], movie[1], movie[2], movie[3], movie[4], movie[5]);
        rows.push(tmp);
      }
      response.json(rows);
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

  public async getSize(request: express.Request, response: express.Response) {
    let connection;
    try {
      connection = await oracledb.getConnection(environment.databaseConfig);
      const result = await connection.execute(
        `SELECT COUNT(1) FROM movies`
      );
      const count = (result.rows[0] as any)[0];
      // tslint:disable-next-line:no-console
      response.json(count);
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

export default new DatabaseController();
