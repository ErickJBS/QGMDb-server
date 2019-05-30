export class Review {
  public userName: string;
  public rating: number;
  public reviewContent: string;

  constructor(user: string, rating: number, reviewContent: string) {
    this.userName = user;
    this.rating = rating;
    this.reviewContent = reviewContent;
  }
}
