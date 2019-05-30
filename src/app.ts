import bodyParser from "body-parser";
import express from "express";
import cors from "./middlewares/cors.middle";
import id from "./middlewares/id.middle";

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: any[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    express.Router();
  }

  public listen() {
    this.app.listen(this.port, () => {
      // tslint:disable-next-line:no-console
      console.log(`server started at http://localhost:${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors.crossOrigin);
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }
}

export default App;
