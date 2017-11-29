import {Produces} from './produces';
import {EndpointInfo, getEndpointInfo, getOperationInfo, OperationInfo} from '../metadata';

describe('@Produces decorator', () => {

    describe('can be applied to', () => {

        describe('a class with', () => {

            it('a single media type', () => {
                // given
                @Produces('test')
                class TestClass { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // expect
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.producedMediaTypes).toEqual(expect.arrayContaining(['test']));
            });

            it('multiple media types', () => {
                // given
                @Produces('test1', 'test2')
                class TestClass { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // expect
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.producedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
            });

            it('multiple media types over multiple decorators', () => {
                // given
                @Produces('test1')
                @Produces('test2')
                class TestClass { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // expect
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.producedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
            });

        });

        describe('a method with', () => {

            it('a single media type', () => {
                // given
                class TestClass {
                    @Produces('test')
                    testMethod(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'testMethod');
                // expect
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.producedMediaTypes).toEqual(expect.arrayContaining(['test']));
            });

            it('multiple media types', () => {
                // given
                class TestClass {
                    @Produces('test1', 'test2')
                    testMethod(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'testMethod');
                // expect
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.producedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
            });

            it('multiple media types over multiple decorators', () => {
                // given
                class TestClass {
                    @Produces('test1')
                    @Produces('test2')
                    testMethod(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'testMethod');
                // expect
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.producedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
            });

        });

        it('a class and a method', () => {
            // given
            @Produces('test1')
            class TestClass {
                @Produces('test2')
                testMethod(): void { /* empty */ }
            }
            // when
            let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'testMethod');
            // expect
            expect(operationInfo).not.toBeUndefined();
            expect(operationInfo.producedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
        });

    });

    describe('throws an exception when', () => {

        it('used on a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Produces('test')
                    static staticMethod(): void { /* empty */ }
                }
            }).toThrowError(/@Produces decorator cannot be used on a static method/);
        });

    });

});
