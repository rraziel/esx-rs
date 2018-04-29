import {getEndpointInfo, setEndpointInfo, EndpointInfo} from './EndpointInfo';

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
    method(httpMethod: string): EndpointInfoBuilder<C> {
        return this.update(endpointInfo => {
            let httpMethods: Set<string> = endpointInfo.httpMethods = endpointInfo.httpMethods || new Set<string>();
            httpMethods.add(httpMethod);
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
     * @return this
     */
    consumes(mediaType: string): EndpointInfoBuilder<C> {
        return this.update(endpointInfo => {
            let consumedMediaTypes: Set<string> = endpointInfo.consumedMediaTypes = endpointInfo.consumedMediaTypes || new Set<string>();
            consumedMediaTypes.add(mediaType);
        });
    }

    /**
     * Add a supported produced type
     * @param mediaType Media type as a string or as a class
     * @return this
     */
    produces(mediaType: string): EndpointInfoBuilder<C> {
        return this.update(endpointInfo => {
            let producedMediaTypes: Set<string> = endpointInfo.producedMediaTypes = endpointInfo.producedMediaTypes || new Set<string>();
            producedMediaTypes.add(mediaType);
        });
    }

    /**
     * Update an endpoint information
     * @param callback Callback
     * @return this
     */
    private update(callback: (endpointInfo: EndpointInfo) => void): EndpointInfoBuilder<C> {
        let endpointInfo: EndpointInfo = getEndpointInfo(this.target);
        callback(endpointInfo);
        setEndpointInfo(this.target, endpointInfo);
        return this;
    }

    /**
     * Get an operation information builder for the specified class
     * @param target Class constructor
     * @param <C>    Class constructor type
     * @return Endpoint information builder
     */
    static of<C extends Function>(target: C): EndpointInfoBuilder<C> {
        return new EndpointInfoBuilder(target);
    }

}

export {
    EndpointInfoBuilder
};
