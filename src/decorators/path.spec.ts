import {Path} from './path';
import {EndpointInfo, getEndpointInfo, getOperationInfo, OperationInfo} from '../metadata';

describe('@Path decorator', () => {

    describe('can be set on', () => {

        it('a class', () => {
            // given
            @Path('/test')
            class TestClass { }
            // when
            let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
            // then
            expect(endpointInfo).not.toBeUndefined();
            expect(endpointInfo.resourcePath).toEqual('/test');
        });

        it('a method', () => {
            // given
            class TestClass {
                @Path('/test')
                method(): void { /* empty */ }
            }
            // when
            let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'method');
            // then
            expect(operationInfo).not.toBeUndefined();
            expect(operationInfo.resourcePath).toEqual('/test');
        });

        it('both a class and a method', () => {
            // given
            @Path('/class-test')
            class TestClass {
                @Path('/test')
                method(): void { /* empty */ }
            }
            // when
            let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'method');
            // then
            expect(operationInfo).not.toBeUndefined();
            expect(operationInfo.resourcePath).toEqual('/class-test/test');
        });

    });

    describe('throws an exception when', () => {

        it('used on a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Path('/test')
                    static staticMethod(): void { /* empty */ }
                }
            }).toThrowError(/@Path decorator cannot be used on a static method/);
        });

    });

});
