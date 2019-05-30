import App from "./app";
import AuthController from "./controllers/auth.controller";
import CatalogController from "./controllers/catalog.controller";
import MovieController from "./controllers/movie.controller";
import ShowsController from "./controllers/shows.controller";

const port = 8000; // default port to listen

const app = new App([
    ShowsController,
    CatalogController,
    MovieController,
    AuthController,
  ], port);

app.listen();
