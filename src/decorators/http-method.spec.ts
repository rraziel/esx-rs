import {DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT} from './http-method';
import {ClassOrMethodDecorator} from './helper';
import {EndpointInfo, getEndpointInfo, getOperationInfo, HttpMethod, OperationInfo} from '../metadata';

class DecoratorInfo {
    decorator: ClassOrMethodDecorator;
    method: HttpMethod;
    name: string;
}

function createHttpMethodSpecification(decoratorInfo: DecoratorInfo) {
    let decoratorName: string = decoratorInfo.name;
    let decorator: ClassOrMethodDecorator = decoratorInfo.decorator;
    let method: HttpMethod = decoratorInfo.method;

    describe('@' + decoratorName + ' decorator', () => {

        describe('can be applied to', () => {

            describe('a class', () => {
                // given
                @decorator
                class TestClass { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // expect
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.httpMethods).toEqual(expect.arrayContaining([method]));
            });

            describe('a method', () => {
                // given
                class TestClass {
                    @decorator
                    method(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'method');
                // then
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.httpMethods).toEqual(expect.arrayContaining([method]));
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
        // expect
        expect(endpointInfo).not.toBeUndefined();
        expect(endpointInfo.httpMethods).toEqual(expect.arrayContaining([HttpMethod.PATCH, HttpMethod.POST, HttpMethod.PUT]));
    });

    it('the same method', () => {
        // given
        class TestClass {
            @GET @DELETE @OPTIONS
            method(): void { /* empty */ }
        }
        // when
        let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'method');
        // then
        expect(operationInfo).not.toBeUndefined();
        expect(operationInfo.httpMethods).toEqual(expect.arrayContaining([HttpMethod.GET, HttpMethod.DELETE, HttpMethod.OPTIONS]));
    });

    it('a class and a method', () => {
        // given
        @PUT
        class TestClass {
            @POST
            method(): void { /* empty */ }
        }
        // when
        let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'method');
        // then
        expect(operationInfo).not.toBeUndefined();
        expect(operationInfo.httpMethods).toEqual(expect.arrayContaining([HttpMethod.POST, HttpMethod.PUT]));
    });

});

const decoratorNamePairs: DecoratorInfo[] = [
    {decorator: DELETE, method: HttpMethod.DELETE, name: 'DELETE'},
    {decorator: GET, method: HttpMethod.GET, name: 'GET'},
    {decorator: HEAD, method: HttpMethod.HEAD, name: 'HEAD'},
    {decorator: OPTIONS, method: HttpMethod.OPTIONS, name: 'OPTIONS'},
    {decorator: PATCH, method: HttpMethod.PATCH, name: 'PATCH'},
    {decorator: POST, method: HttpMethod.POST, name: 'POST'},
    {decorator: PUT, method: HttpMethod.PUT, name: 'PUT'}
];
decoratorNamePairs.forEach(createHttpMethodSpecification);
