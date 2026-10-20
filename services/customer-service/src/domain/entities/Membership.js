export class Membership {
  constructor({
    mid = null,
    mname,
    score
  }) {
    this.mid = mid;
    this.mname = mname;
    this.score = score;
  }
}