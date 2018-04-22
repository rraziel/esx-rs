import {HttpResponseMapper} from './http-response-mapper';
import {HttpHeader} from './http-header';
import {HttpHeaders} from './http-headers';
import {HttpRequest} from './http-request';
import {HttpRequestBuilder} from './http-request-builder';
import {HttpResponse} from './http-response';
import {OperationInfo} from '../metadata';

describe('HTTP response mapper', () => {
    let httpResponseMapper: HttpResponseMapper;

    beforeEach(() => {
        httpResponseMapper = new HttpResponseMapper();
    });

    it('can build an HTTP response', async () => {
        // given
        let httpRequest: HttpRequest = HttpRequestBuilder.of('GET', '/')
            .withHeader(new HttpHeader('Accept', 'text/plain'))
            .build()
        ;
        let operationInfo: OperationInfo = {
            producedMediaTypes: new Set<string>('text/plain')
        };
        let result: string = 'test-result';
        // when
        let httpResponse: HttpResponse = await httpResponseMapper.buildHttpResponse(operationInfo, httpRequest, result);
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
        // when
        let httpResponse: HttpResponse = await httpResponseMapper.buildHttpResponse(operationInfo, httpRequest);
        // expect
        expect(httpResponse.getStatusCode()).toBe(204);
        expect(httpResponse.getHeaderValue(HttpHeaders.CONTENT_TYPE)).toBeUndefined();
        expect(httpResponse.hasPayload()).toBe(false);
        expect(httpResponse.getPayload()).toBeUndefined();
    });

    it.only('serializes to JSON when required', async () => {
        // given
        let httpRequest: HttpRequest = HttpRequestBuilder.of('GET', '/')
            .withHeader(new HttpHeader('Accept', 'application/json'))
            .build()
        ;
        let operationInfo: OperationInfo = {
            producedMediaTypes: new Set<string>('application/json')
        };
        let result: any = {test:'value'};
        // when
        let httpResponse: HttpResponse = await httpResponseMapper.buildHttpResponse(operationInfo, httpRequest, result);
        let responsePayload: string = httpResponse.getPayload();
        // expect
        expect(httpResponse.getStatusCode()).toBe(200);
        expect(httpResponse.getHeaderValue(HttpHeaders.CONTENT_TYPE)).toBe('application/json');
        expect(httpResponse.hasPayload()).toBe(true);
        expect(responsePayload).not.toBeUndefined();
        expect(JSON.parse(responsePayload).test).toBe('value');
    });

});
