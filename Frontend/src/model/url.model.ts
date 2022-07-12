export class Url {
  constructor(
        public id: number,
        public createdAt: Date,
        public originalUrl: string,
        public shortUrl: string,
        public clicks: number,
  ) { }
}
