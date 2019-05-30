import * as express from "express";
import oracledb from "oracledb";
import { environment } from "../enviroments/enviroment";
import { Review } from "../models/review";

export class ReviewsController {
  public path = "/reviews";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router
      .get(this.path, this.getReviews)
      .post(this.path, this.publishReview);
  }

  public async getReviews(request: express.Request, response: express.Response) {
    let connection;
    try {
      const id = request.query.id;
      connection = await oracledb.getConnection(environment.databaseConfig);
      const result = await connection.execute(
        `SELECT u.user_name, r.rating, r.review_content
        FROM reviews r
        JOIN users u
        ON u.user_id = r.user_id
        WHERE r.movie_id = :id`, [id]
      );
      const rows: Review[] = [];
      for (const r of result.rows) {
        const review = r as any;
        const tmp = new Review(review[0], review[1], review[2]);
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

  public async publishReview(request: express.Request, response: express.Response) {
    let connection;
    try {
      const userId = request.body.user;
      const movie = request.body.movie;
      const rating = request.body.rating;
      const content = request.body.content;
      connection = await oracledb.getConnection(environment.databaseConfig);
      await connection.execute(
        `INSERT INTO reviews(user_id, movie_id, rating, review_content)
        VALUES(:userId, :movie, :rating, :content)`, [userId, movie, rating, content]
      );
      response.send("OK");
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log("Something went wrong!", error);
    } finally {
      if (connection) {
        await connection.commit();
        await connection.close();
      }
    }
  }

}

export default new ReviewsController();
