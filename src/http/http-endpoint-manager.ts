import {HttpHeaders} from './http-headers';
import {getHttpMethodFromString, HttpMethod} from './http-method';
import {HttpRequest} from './http-request';
import {HttpResponse} from './http-response';
import {HttpResponseBuilder} from './http-response-builder';
import {HttpStatuses} from './http-statuses';
import {getFullOperationInfo, OperationInfo} from '../metadata';
import {ClassUtils} from '../utils';

/**
 * Cached operation information
 */
interface CachedOperationInfo {
    endpoint: Object;
    methodName: string;
    operationInfo: OperationInfo;
}

/**
 * Matching result
 */
interface MatchingResult {
    path?: boolean;
    method?: boolean;
    contentType?: boolean;
    accept?: boolean;
}

/**
 * HTTP endpoint manager
 */
class HttpEndpointManager {
    private cachedOperationInfos: Array<CachedOperationInfo> = new Array<CachedOperationInfo>();

    /**
     * Register endpoints
     * @param endpoints Endpoints
     * @return this
     */
    registerEndpoints(...endpoints: Object[]): HttpEndpointManager {
        endpoints.forEach(endpoint => this.registerEndpoint(endpoint));
        return this;
    }

    /**
     * Handle the request
     * @param httpRequest HTTP request
     * @return Promise that resolves to an HTTP response
     */
    async handleRequest(httpRequest: HttpRequest): Promise<HttpResponse> {
        let foundCachedOperationInfo: CachedOperationInfo;
        let matchingResult: MatchingResult = {};
        let resourcePath: string = httpRequest.getPath();

        this.forEachOperationEligibleByPath(resourcePath, (cachedOperationInfo, pathMatches) => {
            let operationInfo: OperationInfo = cachedOperationInfo.operationInfo;

            matchingResult.path = true;

            if (this.matchesOperation(httpRequest, operationInfo, matchingResult)) {
                foundCachedOperationInfo = cachedOperationInfo;
            }

            return foundCachedOperationInfo !== undefined;
        });

        if (!foundCachedOperationInfo) {
            return this.buildNoMatchingOperationResponse(matchingResult);
        }

        return await this.invokeCachedOperation(httpRequest, foundCachedOperationInfo);
    }

    /**
     * Invoke a cached operation
     * @param httpRequest         HTTP request
     * @param cachedOperationInfo Cached operation information
     * @return Promise that resolves to an HTTP response
     */
    private async invokeCachedOperation(httpRequest: HttpRequest, cachedOperationInfo: CachedOperationInfo): Promise<HttpResponse> {
        return null;
    }

    /**
     * Test whether an HTTP request matches an operation information
     * @param httpRequest    HTTP request
     * @param operationInfo  Operation information
     * @param matchingResult Matching result
     * @return true if the HTTP request matches the operation information
     */
    private matchesOperation(httpRequest: HttpRequest, operationInfo: OperationInfo, matchingResult: MatchingResult): boolean {
        let httpMethod: HttpMethod = getHttpMethodFromString(httpRequest.getMethod());

        if (operationInfo.httpMethods.has(httpMethod)) {
            matchingResult.method = true;
            return this.matchesMediaTypes(httpRequest, operationInfo, matchingResult);
        }

        return false;
    }

    /**
     * Test whether an HTTP request matches an operation's produced and consumed media types
     * @param httpRequest    HTTP request
     * @param operationInfo  Operation information
     * @param matchingResult Matching result
     * @return true if the HTTP request matches the operation's produced and consumed media types
     */
    private matchesMediaTypes(httpRequest: HttpRequest, operationInfo: OperationInfo, matchingResult: MatchingResult): boolean {
        let contentType: string = httpRequest.getHeaderValue(HttpHeaders.CONTENT_TYPE);
        let accept: string = httpRequest.getHeaderValue(HttpHeaders.ACCEPT);

        if (this.matchesMediaType(contentType, operationInfo.consumedMediaTypes)) {
            matchingResult.contentType = true;

            if (this.matchesMediaType(accept, operationInfo.producedMediaTypes)) {
                matchingResult.accept = true;
                return true;
            }
        }

        return false;
    }

    /**
     * Test whether a media type matches an operation's expected media types
     * @param mediaType           Media type
     * @param operationMediaTypes Operation media types
     * @return true if the media type matches the operation's media types
     */
    private matchesMediaType(mediaType: string, operationMediaTypes: Set<string|Function>): boolean {
        if (mediaType && operationMediaTypes) {
            return operationMediaTypes.has(mediaType); // TODO: should handle Accept properly (wildcards, etc.)
        }

        return true;
    }

    /**
     * Build an HTTP response for a request with no matching operation
     * @param matchingResult Matching result
     * @return HTTP response
     */
    private buildNoMatchingOperationResponse(matchingResult: MatchingResult): HttpResponse {
        let statusCode: number = this.getNoMatchingOperationStatusCode(matchingResult);
        return HttpResponseBuilder.of(statusCode).build();
    }

    /**
     * Get the status code for a request with no matching operation
     * @param matchingResult Matching result
     * @return Status code
     */
    private getNoMatchingOperationStatusCode(matchingResult: MatchingResult): number {
        if (!matchingResult.path) {
            return HttpStatuses.NOT_FOUND;
        }

        if (!matchingResult.method) {
            return HttpStatuses.METHOD_NOT_ALLOWED;
        }

        if (!matchingResult.contentType) {
            return HttpStatuses.UNSUPPORTED_MEDIA_TYPE;
        }

        return HttpStatuses.NOT_ACCEPTABLE;
    }

    /**
     * Register an endpoint
     * @param endpoint Endpoint
     */
    private registerEndpoint(endpoint: Object): void {
        let endpointPrototype: Object = Object.getPrototypeOf(endpoint);
        ClassUtils.getMethodNames(endpointPrototype).forEach(methodName => this.registerEndpointMethod(endpoint, methodName));
    }

    /**
     * Register an endpoint method
     * @param endpoint   Endpoint
     * @param methodName Method name
     */
    private registerEndpointMethod(endpoint: Object, methodName: string): void {
        let operationInfo: OperationInfo = getFullOperationInfo(endpoint, methodName);
        let cachedOperationInfo: CachedOperationInfo = {
            endpoint: endpoint,
            methodName: methodName,
            operationInfo: operationInfo
        };

        this.cachedOperationInfos.push(cachedOperationInfo);
    }

    /**
     * Iterate through all cached operation that are eligible based on their path
     * @param resourcePath Resource path
     * @param predicate    Predicate
     */
    private forEachOperationEligibleByPath(resourcePath: string, predicate: (cachedOperationInfo: CachedOperationInfo, pathMatches: RegExpExecArray) => boolean): void {
        let foundCachedOperationInfo: CachedOperationInfo;

        this.cachedOperationInfos.some(cachedOperationInfo => {
            let operationInfo: OperationInfo = cachedOperationInfo.operationInfo;
            let matches: RegExpExecArray = operationInfo.resourcePathRegExp.exec(resourcePath);
            return matches && predicate(cachedOperationInfo, matches);
        });
    }

}

export {
    HttpEndpointManager
};
