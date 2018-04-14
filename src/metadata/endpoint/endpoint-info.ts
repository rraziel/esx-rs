import {EndpointInfoMetadata} from './endpoint-info-metadata';
import {HttpMethod} from '../../http';
import * as pathToRegexp from 'path-to-regexp';
import 'reflect-metadata';

/**
 * Endpoint information
 */
interface EndpointInfo {
    resourcePath?: string;
    resourcePathRegExp?: RegExp;
    resourcePathKeys?: pathToRegexp.Key[];
    httpMethods?: Set<HttpMethod>;
    consumedMediaTypes?: Set<string|Function>;
    producedMediaTypes?: Set<string|Function>;
}

/**
 * Get endpoint information for a specific class
 * @param classConstructor Class constructor
 * @param <C>              Class constructor type
 * @return Endpoint information
 */
function getEndpointInfo<C extends Function>(classConstructor: C): EndpointInfo {
    let endpointInfo: EndpointInfo = Reflect.getMetadata(EndpointInfoMetadata, classConstructor);
    return endpointInfo;
}

export {
    EndpointInfo,
    getEndpointInfo
};
