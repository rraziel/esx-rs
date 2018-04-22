import {ServerRequestMapper} from './server-request-mapper';
import {Cookie, HttpHeader, HttpHeaders, HttpRequestBuilder, HttpRequest} from '../http';
import {OperationInfo, OperationParameterInfo, ParameterType} from '../metadata';
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
                let operationInfo: OperationInfo = {
                    parameters: [{
                        name: HttpRequest,
                        class: HttpRequest,
                        type: ParameterType.CONTEXT
                    }]
                };
                // when
                let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
                // then
                expect(operationArguments).not.toBeUndefined();
                expect(operationArguments.length).toEqual(1);
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
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.COOKIE
                }, {
                    name: 'test2',
                    class: Number,
                    type: ParameterType.COOKIE
                }]
            };
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
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

        it.skip('with a matrix parameter', async () => { // TODO
            // given
            let queryParameters: Map<string, string> = new Map<string, string>();
            let httpRequest: HttpRequest = new HttpRequest('POST', '/path;test=value;other=x;test2=4');
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
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
                resourcePathKeys: resourcePathKeys,
                resourcePathRegExp: pathToRegexp('/path/:test/subpath/:id', resourcePathKeys),
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
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
            // when
            let errorMessage: string;
            try {
                await serverRequestMapper.buildArguments(operationInfo, httpRequest);
            } catch (e) {
                errorMessage = e.message;
            }
            // then
            expect(errorMessage).toEqual('unknown parameter type -1');
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
            // when
            let errorMessage: string;
            try {
                await serverRequestMapper.buildArguments(operationInfo, httpRequest);
            } catch (e) {
                errorMessage = e.message;
            }
            // then
            expect(errorMessage).toEqual('complex non-payload parameters not implemented yet');
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
            // when
            let errorMessage: string;
            try {
                await serverRequestMapper.buildArguments(operationInfo, httpRequest);
            } catch (e) {
                errorMessage = e.message;
            }
            // then
            expect(errorMessage).toEqual('unknown context class String');
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
            // when
            let errorMessage: string;
            try {
                await serverRequestMapper.buildArguments(operationInfo, httpRequest);
            } catch (e) {
                errorMessage = e.message;
            }
            // then
            expect(errorMessage).toEqual('unknown context class TestClass');
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
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
            // when
            let operationArguments: any[] = await serverRequestMapper.buildArguments(operationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(1);
            expect(operationArguments[0]).toBeUndefined();
        });

    });

});
