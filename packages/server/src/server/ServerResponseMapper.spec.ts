import { ServerResponseMapper } from './ServerResponseMapper';
import { CachedOperationInfo } from './CachedOperationInfo';
import { HttpHeader, HttpHeaders, HttpRequest, HttpRequestBuilder, HttpResponse } from '@esx-rs/http';
import { OperationInfo } from '@esx-rs/core';

describe('Server response mapper', () => {
    let serverResponseMapper: ServerResponseMapper;

    beforeEach(() => {
        serverResponseMapper = new ServerResponseMapper();
    });

    it('can build an HTTP response', async () => {
        // given
        let httpRequest: HttpRequest = HttpRequestBuilder.of('GET', '/')
            .withHeader(new HttpHeader('Accept', 'text/plain'))
            .build()
        ;
        let operationInfo: OperationInfo = new OperationInfo();
        operationInfo.producedMediaTypes.add('text/plain');
        let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
            operationInfo: operationInfo
        };
        let result: string = 'test-result';
        // when
        let httpResponse: HttpResponse = await serverResponseMapper.buildHttpResponse(cachedOperationInfo, httpRequest, result);
        // expect
        expect(httpResponse.getStatusCode()).toBe(200);
        expect(httpResponse.getHeaderValue(HttpHeaders.CONTENT_TYPE)).toBe('text/plain');
        expect(httpResponse.hasPayload()).toBe(true);
        expect(httpResponse.getPayload()).toBe('test-result');
    });

    it('uses status code 204 instead of 200 when there is no response payload', async () => {
        // given
        let httpRequest: HttpRequest = HttpRequestBuilder.of('GET', '/')
            .withHeader(new HttpHeader('Accept', 'text/plain'))
            .build()
        ;
        let operationInfo: OperationInfo = {
            producedMediaTypes: new Set<string>('text/plain')
        };
        let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
            operationInfo: operationInfo
        };
        // when
        let httpResponse: HttpResponse = await serverResponseMapper.buildHttpResponse(cachedOperationInfo, httpRequest);
        // expect
        expect(httpResponse.getStatusCode()).toBe(204);
        expect(httpResponse.getHeaderValue(HttpHeaders.CONTENT_TYPE)).toBeUndefined();
        expect(httpResponse.hasPayload()).toBe(false);
        expect(httpResponse.getPayload()).toBeUndefined();
    });

    it('serializes to JSON when required', async () => {
        // given
        let httpRequest: HttpRequest = HttpRequestBuilder.of('GET', '/')
            .withHeader(new HttpHeader('Accept', 'application/json'))
            .build()
        ;
        let operationInfo: OperationInfo = {
            producedMediaTypes: new Set<string>('application/json')
        };
        let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
            operationInfo: operationInfo
        };
        let result: any = {test:'value'};
        // when
        let httpResponse: HttpResponse = await serverResponseMapper.buildHttpResponse(cachedOperationInfo, httpRequest, result);
        let responsePayload: string = httpResponse.getPayload();
        // expect
        expect(httpResponse.getStatusCode()).toBe(200);
        expect(httpResponse.getHeaderValue(HttpHeaders.CONTENT_TYPE)).toBe('application/json');
        expect(httpResponse.hasPayload()).toBe(true);
        expect(responsePayload).not.toBeUndefined();
        expect(JSON.parse(responsePayload).test).toBe('value');
    });

    describe.skip('correctly selects an exception mapper when', () => {

        it('the mapper exception class matches the exception class', () => {
            // TODO
        });

        it('the mapper exception class matches an ancestor of the exception class', () => {
            // TODO
        });

        it('the mapper class is meant to catch all exceptions', () => {
            // TODO
        });

        it('multiple matching mappers are available', () => {
            // TODO
        });

    });

});
