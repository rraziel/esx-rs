import {Cookie, EntityTag} from '../http';
import { ClassConstructor } from 'utils';

/**
 * Web client interface
 */
abstract class WebClient {

    /**
     * Set the HTTP accept header
     * @param mediaTypes List of accepted media types
     * @return this
     */
    abstract accept(...mediaTypes: string[]): WebClient;

    /**
     * Set the HTTP accept-encoding header
     * @param encodings List of accepted encodings
     */
    abstract acceptEncoding(...encodings: string[]): WebClient;

    /**
     * Set the HTTP accept-language header
     * @param language Accepted language
     * @return this
     */
    abstract acceptLanguage(language: string): WebClient;

    /**
     * Set the HTTP cookie header
     * @param cookie Cookie
     * @return this
     */
    abstract cookie(cookie: Cookie): WebClient;

    /**
     * Set the HTTP content-encoding header
     * @param encoding Content encoding
     * @return this
     */
    abstract encoding(encoding: string): WebClient;

    /**
     * Set the HTTP content-language header
     * @param language Content language
     * @return this
     */
    abstract language(language: string): WebClient;

    /**
     * Set the HTTP if-match or if-none-match header
     * @param tag   Entity tag
     * @param ifNot When true, if-none-match is set, if-match otherwise
     * @return this
     */
    abstract match(tag: EntityTag, ifNot: boolean): WebClient;

    /**
     * Set the HTTP if-modified-since or if-unmodified-since header
     * @param date  Date
     * @param ifNot When true, if-unmodified-since is set, if-modified-since otherwise
     * @return this
     */
    abstract modified(date: Date, ifNot: boolean): WebClient;

}

export {
    WebClient
};
