import { ServerRequestMapper } from './ServerRequestMapper';
import { CachedOperationInfo } from './CachedOperationInfo';
import { OperationInfo, ParameterType } from '@esx-rs/core';
import { Cookie, HttpHeader, HttpHeaders, HttpRequestBuilder, HttpRequest } from '@esx-rs/http';
import * as pathToRegexp from 'path-to-regexp';

const CONTENT_TYPE_JSON: string = 'application/json';
const CONTENT_TYPE_FORM: string = 'application/x-www-form-urlencoded';

class TestClass {}

describe('Server request mapper', () => {
    let serverRequestMapper: ServerRequestMapper;

    beforeEach(() => {
        serverRequestMapper = new ServerRequestMapper();
    });

    describe('can build an argument list from an HTTP request', () => {

        describe('with a context parameter', () => {

            it('for an HTTP request', async () => {
                // given
                let httpRequest: HttpRequest = new HttpRequest('POST', '/');
                let operationInfo: OperationInfo = new OperationInfo();
                operationInfo.parameters.push({
                    name: HttpRequest,
                    class: HttpRequest,
                    type: ParameterType.CONTEXT
                });
                let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                    operationInfo: operationInfo
                };
                // when
                let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
                // then
                expect(operationArguments).not.toBeUndefined();
                expect(operationArguments.length).toBe(1);
                expect(operationArguments[0]).not.toBeUndefined();
                expect(operationArguments[0]).toEqual(httpRequest);
            });

            /* TODO
            it('for an HTTP response', () => {

            });*/

        });

        it('with a cookie parameter', async() => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/')
                .withCookies(new Cookie('test', 'value'), new Cookie('other', 'x'), new Cookie('test2', '4'))
                .build()
            ;
            let operationInfo: OperationInfo = new OperationInfo();
            operationInfo.parameters.push({
                name: 'test',
                class: String,
                type: ParameterType.COOKIE
            }, {
                name: 'test2',
                class: Number,
                type: ParameterType.COOKIE
            });
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toBe(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toBe('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toBe(4);
        });

        it('with a form parameter', async () => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/')
                .withHeader(new HttpHeader(HttpHeaders.CONTENT_TYPE, CONTENT_TYPE_FORM))
                .withPayload('test=value&other=x&test2=4')
                .build()
            ;
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.FORM
                }, {
                    name: 'test2',
                    class: Number,
                    type: ParameterType.FORM
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toBe(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toBe('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toBe(4);
        });

        it('with a header parameter', async () => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/')
                .withHeader(new HttpHeader(HttpHeaders.CONTENT_TYPE, CONTENT_TYPE_JSON))
                .withHeaders(new HttpHeader('test', 'value'), new HttpHeader('test3', 'true'), new HttpHeader('accept', 'application/json'), new HttpHeader('test2', '4'))
                .build()
            ;
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.HEADER
                }, {
                    name: 'test2',
                    class: Number,
                    type: ParameterType.HEADER
                }, {
                    name: 'test3',
                    class: Boolean,
                    type: ParameterType.HEADER
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(3);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
            expect(operationArguments[2]).not.toBeUndefined();
            expect(operationArguments[2]).toEqual(true);
        });

        it('with a matrix parameter', async () => { // TODO
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('GET', '/path')
                .withMatrix('test', 'value')
                .withMatrix('other', 'x')
                .withMatrix('test2', '4')
                .build()
            ;
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.MATRIX
                }, {
                    name: 'test2',
                    class: Number,
                    type: ParameterType.MATRIX
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
        });

        it('with a path parameter', async () => {
            // given
            let httpRequest: HttpRequest = new HttpRequest('POST', '/path/value/subpath/4');
            let resourcePathKeys: pathToRegexp.Key[] = [];
            let operationInfo: OperationInfo = {
                resourcePath: '/path/:test/subpath/:id',
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.PATH
                }, {
                    name: 'id',
                    class: Number,
                    type: ParameterType.PATH
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo,
                resourcePathKeys: resourcePathKeys,
                resourcePathRegExp: pathToRegexp('/path/:test/subpath/:id', resourcePathKeys),
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
        });

        it('with a query parameter', async () => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/')
                .withQuery('test', 'value')
                .withQuery('other', 'x')
                .withQuery('test2', '4')
                .build()
            ;
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.QUERY
                }, {
                    name: 'test2',
                    class: Number,
                    type: ParameterType.QUERY
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
        });

        it('with a body parameter', async () => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/')
                .withPayload('value')
                .build()
            ;
            let operationInfo: OperationInfo = {
                parameters: [{
                    class: String,
                    type: ParameterType.BODY
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(1);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
        });

        it('with no arguments', async () => {
            // given
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            let operationInfo: OperationInfo = {};
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(0);
        });

    });

    describe('cannot build an argument when', () => {

        it('the parameter type is unknown', async () => {
            // given
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: <ParameterType.CONTEXT> -1
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // expect
            await expect(serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest)).rejects.toThrowError('unknown parameter type -1');
        });

        it('the parameter is a complex parameter', async () => {
            // given
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: TestClass,
                    type: <ParameterType.CONTEXT> -1
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // expect
            await expect(serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest)).rejects.toThrowError('complex non-payload parameters not implemented yet');
        });

        it('a context class is a primitive', async () => {
            // given
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: String,
                    class: String,
                    type: ParameterType.CONTEXT
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // expect
            await expect(serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest)).rejects.toThrowError('unknown context class String');
        });

        it('a context class is unknown', async () => {
            // given
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: TestClass,
                    class: TestClass,
                    type: ParameterType.CONTEXT
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // expect
            await expect(serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest)).rejects.toThrowError('unknown context class TestClass');
        });

        it('a form parameter is needed but the content type is incorrect', async () => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/')
                .withHeader(new HttpHeader(HttpHeaders.CONTENT_TYPE, CONTENT_TYPE_JSON))
                .withPayload('test=value&other=x&test2=4')
                .build()
            ;
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.FORM
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(1);
            expect(operationArguments[0]).toBeUndefined();
        });

        it('a form parameter is needed but there is no body', async () => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/')
                .withHeader(new HttpHeader(HttpHeaders.CONTENT_TYPE, CONTENT_TYPE_FORM))
                .build()
            ;
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.FORM
                }]
            };
            let cachedOperationInfo: CachedOperationInfo = <CachedOperationInfo> {
                operationInfo: operationInfo
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(cachedOperationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(1);
            expect(operationArguments[0]).toBeUndefined();
        });

    });

});
