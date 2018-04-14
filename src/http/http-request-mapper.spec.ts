import {HttpRequestMapper} from './http-request-mapper';
import {HttpCookie} from './http-cookie';
import {HttpHeader} from './http-header';
import {HttpRequest} from './http-request';
import {OperationInfo, OperationParameterInfo, ParameterType} from '../metadata';

describe('HTTP request mapper', () => {
    let httpRequestMapper: HttpRequestMapper;

    beforeEach(() => {
        httpRequestMapper = new HttpRequestMapper();
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
                let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
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
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            httpRequest.cookies = [new HttpCookie('test', 'value'), new HttpCookie('other', 'x'), new HttpCookie('test2', '4')];
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
            let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
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
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            httpRequest.headers = [new HttpHeader('content-type', 'application/x-www-form-urlencoded')];
            httpRequest.body = 'test=value&other=x&test2=4';
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
            let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
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
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            httpRequest.headers = [new HttpHeader('content-type', 'application/json'), new HttpHeader('test', 'value'), new HttpHeader('accept', 'application/json'), new HttpHeader('test2', '4')];
            let operationInfo: OperationInfo = {
                parameters: [{
                    name: 'test',
                    class: String,
                    type: ParameterType.HEADER
                }, {
                    name: 'test2',
                    class: Number,
                    type: ParameterType.HEADER
                }]
            };
            // when
            let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
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
            let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
        });

        it.skip('with a path parameter', async () => {
            // given
            let httpRequest: HttpRequest = new HttpRequest('POST', '/path/value/subpath');
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
            // when
            let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
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
            let queryParameters: Map<string, string> = new Map<string, string>();
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            httpRequest.queryParameters = queryParameters.set('test', 'value').set('other', 'x').set('test2', '4');
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
            let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(2);
            expect(operationArguments[0]).not.toBeUndefined();
            expect(operationArguments[0]).toEqual('value');
            expect(operationArguments[1]).not.toBeUndefined();
            expect(operationArguments[1]).toEqual(4);
        });

        it('with no arguments', async () => {
            // given
            let httpRequest: HttpRequest = new HttpRequest('POST', '/');
            let operationInfo: OperationInfo = {};
            // when
            let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(0);
        });

    });

});
