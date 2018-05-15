import {HttpHeader} from './HttpHeader';

/**
 * Abstract HTTP message builder
 * @param <T> Built type
 */
abstract class AbstractHttpMessageBuilder<T> {
    protected headers?: Array<HttpHeader>;
    protected payload?: string;

    /**
     * Add a HTTP header
     * @param httpHeader HTTP header
     * @return this
     */
    withHeader(httpHeader: HttpHeader): AbstractHttpMessageBuilder<T> {
        return this.withHeaders(httpHeader);
    }

    /**
     * Add HTTP headers
     * @param httpHeaders HTTP headers
     * @return this
     */
    withHeaders(...httpHeaders: HttpHeader[]): AbstractHttpMessageBuilder<T> {
        this.headers = this.headers || new Array<HttpHeader>();
        this.headers.push(...httpHeaders);
        return this;
    }

    /**
     * Set the payload
     * @param payload Payload
     * @return this
     */
    withPayload(payload: string): AbstractHttpMessageBuilder<T> {
        this.payload = payload;
        return this;
    }

    /**
     * Build the HTTP message
     * @return HTTP message
     */
    abstract build(): T;

}

export {
    AbstractHttpMessageBuilder
};
