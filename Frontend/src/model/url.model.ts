export class Url {
    constructor(
        public id: number,
        public createdAt: Date,
        public original_url: string,
        public clicks: number,
    ) { }
}