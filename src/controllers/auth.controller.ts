import * as express from "express";
import jwt from "jsonwebtoken";
import oracledb from "oracledb";
import { environment } from "../enviroments/enviroment";

class AuthController {
  public static secretKey = "Q10ZUdG3snkk4Wm";

  public static verifyToken(request: express.Request, response: express.Response, next: express.NextFunction) {
    const bearerHeader = request.headers.authorization;
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      request.token = bearerToken;
      next();
    } else {
      response.sendStatus(403);
    }
  }

  private static async checkCredentials(user: string, password: string) {
    let connection;
    try {
      connection = await oracledb.getConnection(environment.databaseConfig);
      const sql = "SELECT user_name FROM users WHERE user_id=:id AND password=:pass";
      const result = await connection.execute(sql, [user, password]);
      if (result.rows.length > 0) {
        return (result.rows[0] as any)[0];
      } else {
        return undefined;
      }
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
  public path = "/login";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path, this.userLogin);
  }

  public async userLogin(request: express.Request, response: express.Response) {
    if (typeof request.body === "undefined") {
      response.json({});
      return;
    }
    const user = request.body.user;
    const password = request.body.password;

    const result = await AuthController.checkCredentials(user, password);
    if (result) {
      jwt.sign({ user }, AuthController.secretKey, { expiresIn: "60m"}, (error, token) => {
        response.json({ token , result});
      });
    } else {
      response.json({});
    }
  }
}

export default new AuthController();
