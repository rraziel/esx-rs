import {DELETE, GET, HEAD, HttpMethod, OPTIONS, PATCH, POST, PUT} from './HttpMethod';
import {ClassOrMethodDecorator} from './helper';
import {EndpointInfo, getEndpointInfo, getFullOperationInfo, OperationInfo} from '../metadata';

const HTTP_METHOD_DELETE: string = 'DELETE';
const HTTP_METHOD_GET: string = 'GET';
const HTTP_METHOD_HEAD: string = 'HEAD';
const HTTP_METHOD_OPTIONS: string = 'OPTIONS';
const HTTP_METHOD_PATCH: string = 'PATCH';
const HTTP_METHOD_POST: string = 'POST';
const HTTP_METHOD_PUT: string = 'PUT';

class DecoratorInfo {
    decorator: ClassOrMethodDecorator;
    method: string;
    name: string;
}

function createHttpMethodSpecification(decoratorInfo: DecoratorInfo): void {
    let decoratorName: string = decoratorInfo.name;
    let decorator: ClassOrMethodDecorator = decoratorInfo.decorator;
    let method: string = decoratorInfo.method;

    describe('@' + decoratorName + ' decorator', () => {

        describe('can be applied to', () => {

            describe('a class', () => {
                // given
                @decorator
                class TestClass { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // then
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.httpMethods).toEqual(new Set<string>([method]));
            });

            describe('a method', () => {
                // given
                class TestClass {
                    @decorator
                    method(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getFullOperationInfo(new TestClass(), 'method');
                // then
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.httpMethods).toEqual(new Set<string>([method]));
            });

            describe('a base class', () => {
                // given
                @decorator
                class TestClassBase { }
                class TestClass extends TestClassBase { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // then
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.httpMethods).toEqual(new Set<string>([method]));
            });

            describe('a base class method', () => {
                // given
                class TestClassBase {
                    @decorator
                    method(): void { /* empty */ }
                }
                class TestClass extends TestClassBase {
                    method(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getFullOperationInfo(new TestClass(), 'method');
                // then
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.httpMethods).toEqual(new Set<string>([method]));
            });

        });

        describe('throws an exception when', () => {

            it('used on a static method', () => {
                // expect
                expect(() => {
                    class TestClass {
                        @decorator
                        static staticMethod(): void { /* empty */ }
                    }
                }).toThrowError(/decorator cannot be used on a static method/);
            });

        });

    });
}

describe('Multiple HTTP method decorators can be applied to', () => {

    it('the same class', () => {
        // given
        @PATCH @POST @PUT
        class TestClass { }
        // when
        let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
        // then
        expect(endpointInfo).not.toBeUndefined();
        expect(endpointInfo.httpMethods).toEqual(new Set<string>([HTTP_METHOD_PATCH, HTTP_METHOD_POST, HTTP_METHOD_PUT]));
    });

    it('the same method', () => {
        // given
        class TestClass {
            @GET @DELETE @OPTIONS
            method(): void { /* empty */ }
        }
        // when
        let operationInfo: OperationInfo = getFullOperationInfo(new TestClass(), 'method');
        // then
        expect(operationInfo).not.toBeUndefined();
        expect(operationInfo.httpMethods).toEqual(new Set<string>([HTTP_METHOD_GET, HTTP_METHOD_DELETE, HTTP_METHOD_OPTIONS]));
    });

    it('a class and a method', () => {
        // given
        @PUT
        class TestClass {
            @POST
            method(): void { /* empty */ }
        }
        // when
        let operationInfo: OperationInfo = getFullOperationInfo(new TestClass(), 'method');
        // then
        expect(operationInfo).not.toBeUndefined();
        expect(operationInfo.httpMethods).toEqual(new Set<string>([HTTP_METHOD_POST, HTTP_METHOD_PUT]));
    });

});

const decoratorInfos: DecoratorInfo[] = [
    {decorator: HttpMethod('TEST'), method: 'TEST', name: 'HttpMethod'},
    {decorator: DELETE, method: HTTP_METHOD_DELETE, name: 'DELETE'},
    {decorator: GET, method: HTTP_METHOD_GET, name: 'GET'},
    {decorator: HEAD, method: HTTP_METHOD_HEAD, name: 'HEAD'},
    {decorator: OPTIONS, method: HTTP_METHOD_OPTIONS, name: 'OPTIONS'},
    {decorator: PATCH, method: HTTP_METHOD_PATCH, name: 'PATCH'},
    {decorator: POST, method:HTTP_METHOD_POST, name: 'POST'},
    {decorator: PUT, method: HTTP_METHOD_PUT, name: 'PUT'}
];
decoratorInfos.forEach(createHttpMethodSpecification);
