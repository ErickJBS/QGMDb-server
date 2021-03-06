export class Movie {
  public movieId: number;
  public movieTitle: string;
  public duration: number;
  public releaseDate: Date;
  public movieAbstract: string;
  public cover: string;

  constructor(id: number, title: string, duration: number,
              release: Date, abs: string, cover: string) {
      this.movieId = id;
      this.movieTitle = title;
      this.duration = duration;
      this.releaseDate = release;
      this.movieAbstract = abs;
      this.cover = cover;
  }
}
