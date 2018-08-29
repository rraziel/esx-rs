import { CachedOperationInfo } from './CachedOperationInfo';
import { MatchingResult } from './MatchingResult';
import { ServerRequestMapper } from './ServerRequestMapper';
import { ServerResponseMapper } from './ServerResponseMapper';
import { ClassUtils, MediaTypeUtils } from '../utils';
import { getFullOperationInfo, OperationInfo } from '@esx-rs/core';
import { HttpHeaders, HttpRequest, HttpResponse, HttpResponseBuilder, HttpStatuses } from '@esx-rs/http';

/**
 * Endpoint manager
 */
class EndpointManager {
    private cachedOperationInfos: Array<CachedOperationInfo> = new Array<CachedOperationInfo>();
    private serverResponseMapper: ServerResponseMapper = new ServerResponseMapper();
    private serverRequestMapper: ServerRequestMapper = new ServerRequestMapper();

    /**
     * Register endpoints
     * @param endpoints Endpoints
     * @return this
     */
    registerEndpoints(...endpoints: Object[]): EndpointManager {
        endpoints.forEach(endpoint => this.registerEndpoint(endpoint));
        return this;
    }

    /**
     * Handle the request
     * @param httpRequest HTTP request
     * @return Promise that resolves to an HTTP response
     */
    async handleRequest(httpRequest: HttpRequest): Promise<HttpResponse> {
        let foundCachedOperationInfo: CachedOperationInfo|undefined;
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

        if (foundCachedOperationInfo) {
            return await this.invokeCachedOperation(httpRequest, foundCachedOperationInfo);
        }

        return this.buildNoMatchingOperationResponse(matchingResult);
    }

    /**
     * Invoke a cached operation
     * @param httpRequest         HTTP request
     * @param cachedOperationInfo Cached operation information
     * @return Promise that resolves to an HTTP response
     */
    private async invokeCachedOperation(httpRequest: HttpRequest, cachedOperationInfo: CachedOperationInfo): Promise<HttpResponse> {
        let operationParameters: any[];
        let httpResponse: HttpResponse;
        let methodName: string = cachedOperationInfo.methodName;
        let endpoint: Object = cachedOperationInfo.endpoint;
        let result: any;

        try {
            operationParameters = await this.serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            result = await endpoint[methodName].apply(endpoint, operationParameters);
            httpResponse = await this.serverResponseMapper.buildHttpResponse(cachedOperationInfo, httpRequest, result);
        } catch (e) {
            httpResponse = await this.serverResponseMapper.buildHttpErrorResponse(cachedOperationInfo, httpRequest, e);
        }

        return httpResponse;
    }

    /**
     * Test whether an HTTP request matches an operation information
     * @param httpRequest    HTTP request
     * @param operationInfo  Operation information
     * @param matchingResult Matching result
     * @return true if the HTTP request matches the operation information
     */
    private matchesOperation(httpRequest: HttpRequest, operationInfo: OperationInfo, matchingResult: MatchingResult): boolean {
        let httpMethod: string = httpRequest.getMethod();

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
        let accept: string|undefined = httpRequest.getHeaderValue(HttpHeaders.ACCEPT);

        if (this.supportsPayloadMediaType(httpRequest, operationInfo)) {
            matchingResult.contentType = true;

            if (MediaTypeUtils.supportsRequestedMediaTypes(accept, operationInfo.producedMediaTypes as Set<string>)) { // TODO: support Set<string|Function>
                matchingResult.accept = true;
                return true;
            }
        }

        return false;
    }

    /**
     * Test whether an operation supports a payload's media type
     * @param httpRequest   HTTP request
     * @param operationInfo Operation information
     * @return true if the operation supports the payload media type
     */
    private supportsPayloadMediaType(httpRequest: HttpRequest, operationInfo: OperationInfo): boolean {
        let contentType: string|undefined = httpRequest.getHeaderValue(HttpHeaders.CONTENT_TYPE);

        if (!contentType || !operationInfo) {
            return true;
        }

        return operationInfo.consumedMediaTypes.has(contentType);
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
        let cachedOperationInfo: CachedOperationInfo = new CachedOperationInfo(endpoint, methodName, operationInfo);
        this.cachedOperationInfos.push(cachedOperationInfo);
    }

    /**
     * Iterate through all cached operation that are eligible based on their path
     * @param resourcePath Resource path
     * @param predicate    Predicate
     */
    private forEachOperationEligibleByPath(resourcePath: string, predicate: (cachedOperationInfo: CachedOperationInfo, pathMatches: RegExpExecArray) => boolean): void {
        this.cachedOperationInfos.some(cachedOperationInfo => this.matchOperationEligibleByPath(cachedOperationInfo, resourcePath, predicate));
    }

    /**
     * Match an operation eligible by path
     * @param cachedOperationInfo Cached operation information
     * @param resourcePath        Resource path
     * @param predicate           Predicate
     * @return true if there is a match
     */
    private matchOperationEligibleByPath(cachedOperationInfo: CachedOperationInfo, resourcePath: string, predicate: (cachedOperationInfo: CachedOperationInfo, pathMatches: RegExpExecArray) => boolean): boolean {
        let matches: RegExpExecArray|null = cachedOperationInfo.resourcePathRegExp.exec(resourcePath);
        if (matches) {
            return predicate(cachedOperationInfo, matches);
        }

        return false;
    }

}

export {
    EndpointManager
};
