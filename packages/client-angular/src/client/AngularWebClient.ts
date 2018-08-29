import { WebClient } from '@esx-rs/client';
import { Cookie, EntityTag } from '@esx-rs/http';
import { HttpClient } from '@angular/common/http';

/**
 * Angular Web client
 */
class AngularWebClient extends WebClient {
    private readonly httpClient: HttpClient;

    /**
     * Class constructor
     * @param httpClient HTTP client
     */
    constructor(httpClient: HttpClient) {
        super();
        this.httpClient = httpClient;
    }

    /**
     * Set the HTTP accept header
     * @param mediaTypes List of accepted media types
     * @return this
     */
    accept(...mediaTypes: Array<string>): WebClient {
        // TODO
        return this;
    }

    /**
     * Set the HTTP accept-encoding header
     * @param encodings List of accepted encodings
     */
    acceptEncoding(...encodings: Array<string>): WebClient {
        // TODO
        return this;
    }

    /**
     * Set the HTTP accept-language header
     * @param language Accepted language
     * @return this
     */
    acceptLanguage(language: string): WebClient {
        // TODO
        return this;
    }

    /**
     * Set the HTTP cookie header
     * @param cookie Cookie
     * @return this
     */
    cookie(cookie: Cookie): WebClient {
        // TODO
        return this;
    }

    /**
     * Set the HTTP content-encoding header
     * @param encoding Content encoding
     * @return this
     */
    encoding(encoding: string): WebClient {
        // TODO
        return this;
    }

    /**
     * Set the HTTP content-language header
     * @param language Content language
     * @return this
     */
    language(language: string): WebClient {
        // TODO
        return this;
    }

    /**
     * Set the HTTP if-match or if-none-match header
     * @param tag   Entity tag
     * @param ifNot When true, if-none-match is set, if-match otherwise
     * @return this
     */
    match(tag: EntityTag, ifNot: boolean): WebClient {
        // TODO
        return this;
    }

    /**
     * Set the HTTP if-modified-since or if-unmodified-since header
     * @param date  Date
     * @param ifNot When true, if-unmodified-since is set, if-modified-since otherwise
     * @return this
     */
    modified(date: Date, ifNot: boolean): WebClient {
        // TODO
        return this;
    }

}

export {
    AngularWebClient
};
