import * as express from "express";
import oracledb from "oracledb";
import { environment } from "../enviroments/enviroment";

class IdGenerator {

  public async id(request: express.Request, response: express.Response, next: express.NextFunction) {
    // POST options: people, movies, functions
    const database = request.path.substring(1); // Eliminate the slash in the path

    let connection;
    try {
      connection = await oracledb.getConnection(environment.databaseConfig);

      let sql = "SELECT id_value FROM ids WHERE id_field=:id";
      const result = await connection.execute(sql, [database]);
      const id = (result.rows[0] as any)[0];
      request.body.id = id;

      sql = "UPDATE ids SET id_value=:value WHERE id_field:id";
      await connection.execute(sql, [id + 1, database]);

    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log("Something went wrong!", error);
    } finally {
      if (connection) {
        // conn assignment worked, need to close
        await connection.close();
      }
    }
    next();
  }

}

export default new IdGenerator();
