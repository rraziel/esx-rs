import {Consumes} from './consumes';
import {EndpointInfo, getEndpointInfo, getOperationInfo, OperationInfo} from '../metadata';

describe('@Consumes decorator', () => {

    describe('can be applied to', () => {

        describe('a class with', () => {

            it('a single media type', () => {
                // given
                @Consumes('test')
                class TestClass { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // expect
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.consumedMediaTypes).toEqual(expect.arrayContaining(['test']));
            });

            it('multiple media types', () => {
                // given
                @Consumes('test1', 'test2')
                class TestClass { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // expect
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.consumedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
            });

            it('multiple media types over multiple decorators', () => {
                // given
                @Consumes('test1')
                @Consumes('test2')
                class TestClass { }
                // when
                let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                // expect
                expect(endpointInfo).not.toBeUndefined();
                expect(endpointInfo.consumedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
            });

        });

        describe('a method with', () => {

            it('a single media type', () => {
                // given
                class TestClass {
                    @Consumes('test')
                    testMethod(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'testMethod');
                // expect
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.consumedMediaTypes).toEqual(expect.arrayContaining(['test']));
            });

            it('multiple media types', () => {
                // given
                class TestClass {
                    @Consumes('test1', 'test2')
                    testMethod(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'testMethod');
                // expect
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.consumedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
            });

            it('multiple media types over multiple decorators', () => {
                // given
                class TestClass {
                    @Consumes('test1')
                    @Consumes('test2')
                    testMethod(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'testMethod');
                // expect
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.consumedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
            });

        });

        it('a class and a method', () => {
            // given
            @Consumes('test1')
            class TestClass {
                @Consumes('test2')
                testMethod(): void { /* empty */ }
            }
            // when
            let operationInfo: OperationInfo = getOperationInfo(new TestClass(), 'testMethod');
            // expect
            expect(operationInfo).not.toBeUndefined();
            expect(operationInfo.consumedMediaTypes).toEqual(expect.arrayContaining(['test1', 'test2']));
        });

    });

    describe('throws an exception when', () => {

        it('used on a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    @Consumes('test')
                    static staticMethod(): void { /* empty */ }
                }
            }).toThrowError(/@Consumes decorator cannot be used on a static method/);
        });

    });

});
