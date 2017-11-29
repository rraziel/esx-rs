import {EndpointInfo} from './endpoint-info';
import {EndpointInfoMetadata} from './endpoint-info-metadata';
import {HttpMethod} from '../http-method';
import 'reflect-metadata';

/**
 * Endpoint information builder
 * @param <C> Constructor type
 */
class EndpointInfoBuilder<C extends Function> {
    private target: C;

    /**
     * Class constructor
     * @param target Target
     */
    private constructor(target: C) {
        this.target = target;
    }

    /**
     * Add a supported HTTP method
     * @param httpMethod HTTP method
     */
    method(httpMethod: HttpMethod): EndpointInfoBuilder<C> {
        return this.update(endpointInfo => {
            let httpMethods: HttpMethod[] = endpointInfo.httpMethods = endpointInfo.httpMethods || [];
            httpMethods.push(httpMethod);
        });
    }

    /**
     * Set the resource path
     * @param resourcePath Resoure path
     * @return this
     */
    path(resourcePath: string): EndpointInfoBuilder<C> {
        return this.update(endpointInfo => endpointInfo.resourcePath = resourcePath);
    }

    /**
     * Add a supported consumed type
     * @param mediaType Media type as a string or as a class
     * @param <T>       Constructor type
     * @return this
     */
    consumes<T extends Function>(mediaType: string|T): EndpointInfoBuilder<C> {
        return this.update(endpointInfo => {
            let consumedMediaTypes: (string|Function)[] = endpointInfo.consumedMediaTypes = endpointInfo.consumedMediaTypes || [];
            consumedMediaTypes.push(mediaType);
        });
    }

    /**
     * Add a supported produced type
     * @param mediaType Media type as a string or as a class
     * @param <T>       Constructor type
     * @return this
     */
    produces<T extends Function>(mediaType: string|T): EndpointInfoBuilder<C> {
        return this.update(endpointInfo => {
            let producedMediaTypes: (string|Function)[] = endpointInfo.producedMediaTypes = endpointInfo.producedMediaTypes || [];
            producedMediaTypes.push(mediaType);
        });
    }

    /**
     * Update an endpoint information
     * @param callback Callback
     * @return this
     */
    private update(callback: (endpointInfo: EndpointInfo) => void): EndpointInfoBuilder<C> {
        let operationInfo: EndpointInfo = Reflect.getMetadata(EndpointInfoMetadata, this.target) || {};
        callback(operationInfo);
        Reflect.defineMetadata(EndpointInfoMetadata, operationInfo, this.target);
        return this;
    }

    /**
     * Get an operation information builder for the specified class
     * @param target Class constructor
     * @param <T>    Class constructor type
     * @return Endpoint information builder
     */
    static of<C extends Function>(target: C): EndpointInfoBuilder<C> {
        return new EndpointInfoBuilder(target);
    }

}

export {
    EndpointInfoBuilder
};
