import 'reflect-metadata';

/**
 * Endpoint information metadata
 */
const EndpointInfoMetadata: Symbol = Symbol('esx-rs:endpoint');

/**
 * Endpoint information
 */
class EndpointInfo {
    resourcePath?: string;
    httpMethods: Set<string> = new Set<string>();
    consumedMediaTypes: Set<string|Function> = new Set<string>();
    producedMediaTypes: Set<string|Function> = new Set<string>();
}

/**
 * Get endpoint information for a specific class
 * @param classConstructor Class constructor
 * @param <C>              Class constructor type
 * @return Endpoint information
 */
function getEndpointInfo<C extends Function>(classConstructor: C): EndpointInfo {
    let endpointInfo: EndpointInfo = Reflect.getMetadata(EndpointInfoMetadata, classConstructor) || new EndpointInfo();
    return endpointInfo;
}

/**
 * Set an operation information
 * @param classConstructor Class constructor
 * @param endpointInfo     Endpoint information
 * @param <C>              Class constructor type
 */
function setEndpointInfo<C extends Function>(classConstructor: C, endpointInfo: EndpointInfo): void {
    Reflect.defineMetadata(EndpointInfoMetadata, endpointInfo, classConstructor);
}

export {
    EndpointInfo,
    getEndpointInfo,
    setEndpointInfo
};
