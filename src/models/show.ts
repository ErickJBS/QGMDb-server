import { Movie } from "./movie";

export class Show {
  public functionId: number;
  public functionDate: Date;
  public location: string;
  public movie: Movie;

  constructor(id: number, date: Date, location: string) {
      this.functionId = id;
      this.functionDate = date;
      this.location = location;
  }

  public setMovie(id: number, title: string, duration: number, release: Date,
                  abs: string, cover: string) {
      this.movie = new Movie(id, title, duration, release, abs, cover);
  }
}
