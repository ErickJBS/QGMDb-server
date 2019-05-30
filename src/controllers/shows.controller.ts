import * as express from "express";
import oracledb from "oracledb";
import { environment } from "../enviroments/enviroment";
import { Show } from "../models/show";

class DatabaseController {
  public path = "/shows";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getFunctions);
  }

  public async getFunctions(request: express.Request, response: express.Response) {
    let connection;
    try {
      const lower = request.query.lower;
      const upper = request.query.upper;
      connection = await oracledb.getConnection(environment.databaseConfig);
      const result = await connection.execute(
        `SELECT * FROM (
          SELECT f.function_id, f.function_date, f.location, m.movie_id,
          m.movie_title, m.release_date, m.duration, m.abstract, m.cover,
          row_number() over (order by f.function_date DESC) r
          FROM functions f
          JOIN movies m
          ON f.movie_id = m.movie_id
          ORDER BY f.function_date DESC
        )
        WHERE r BETWEEN :lower AND :upper`, [lower, upper]
      );
      const rows: Show[] = [];
      for (const f of result.rows) {
        const fun = f as any;
        const tmp = new Show(fun[0], fun[1], fun[2]);
        tmp.setMovie(fun[3], fun[4], fun[6], fun[5], fun[7], fun[8]);
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

}

export default new DatabaseController();
