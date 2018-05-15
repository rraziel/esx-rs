import {AbstractHttpMessage} from './AbstractHttpMessage';
import {HttpHeader} from './HttpHeader';

/**
 * HTTP response
 */
class HttpResponse extends AbstractHttpMessage {
    private statusCode: number;

    /**
     * Class constructor
     * @param statusCode Status code
     * @param headers    HTTP headers
     * @param payload    Payload
     */
    constructor(statusCode: number, headers?: Array<HttpHeader>, payload?: string) {
        super(headers, payload);
        this.statusCode = statusCode;
    }

    /**
     * Get the status code
     * @return Status code
     */
    getStatusCode(): number {
        return this.statusCode;
    }

}

export {
    HttpResponse
};
