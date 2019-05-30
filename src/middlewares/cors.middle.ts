import * as express from "express";

class Cors {

  public crossOrigin(request: express.Request, response: express.Response, next: express.NextFunction) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  }

}

export default new Cors();
