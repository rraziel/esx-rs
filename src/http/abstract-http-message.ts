import {HttpHeader} from './http-header';

/**
 * Abstract HTTP message
 */
abstract class AbstractHttpMessage {
    private headers: Array<HttpHeader>;
    private payload?: string;

    /**
     * Class constructor
     * @param headers List of HTTP headers
     * @param payload Payload
     */
    constructor(headers?: Array<HttpHeader>, payload?: string) {
        this.headers = headers;
        this.payload = payload;
    }

    /**
     * Get all HTTP headers
     * @return HTTP headers
     */
    getHeaders(): Array<HttpHeader> {
        return this.headers;
    }

    /**
     * Get an HTTP header
     * @param headerName Header name
     * @return HTTP header
     */
    getHeader(headerName: string): HttpHeader {
        return this.headers && this.headers.find(httpHeader => httpHeader.getName() === headerName);
    }

    /**
     * Get an HTTP header value
     * @param headerName Header name
     * @return Header value
     */
    getHeaderValue(headerName: string): string {
        let httpHeader: HttpHeader = this.getHeader(headerName);
        return httpHeader && httpHeader.getValue();
    }

    /**
     * Test whether a payload is present
     * @return true if a payload is present
     */
    hasPayload(): boolean {
        return this.payload !== undefined;
    }

    /**
     * Get the payload
     * @return Payload
     */
    getPayload(): string {
        return this.payload;
    }

}

export {
    AbstractHttpMessage
};
