export class HTTPError extends Error {
    constructor(status: number, url: string, message: string) {
        super(`HTTP Error: ${status}\n url: ${url}\n message: ${message}`);
        this.name = "HTTPError";
    }
}
