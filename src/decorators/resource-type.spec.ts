import {Consumes, Produces} from './resource-type';
import {EndpointInfo, getEndpointInfo, getMergedOperationInfo, OperationInfo} from '../metadata';
import {ClassOrMethodDecorator} from './helper';

class DecoratorInfo {
    name: string;
    decorator: (...mediaTypes: (string|Function)[]) => ClassOrMethodDecorator;
    endpointValue: (endpointInfo: EndpointInfo) => any;
    operationValue: (operationInfo: OperationInfo) => any;
}

function createResourceTypeSpecification(decoratorInfo: DecoratorInfo): void {
    let decoratorName: string = decoratorInfo.name;
    let decorator: (...mediaTypes: (string|Function)[]) => ClassOrMethodDecorator = decoratorInfo.decorator;
    let endpointValue: (endpointInfo: EndpointInfo) => any = decoratorInfo.endpointValue;
    let operationValue: (operationInfo: OperationInfo) => any = decoratorInfo.operationValue;

    describe('@' + decoratorName + ' decorator', () => {

        describe('can be applied to', () => {

            describe('a class with', () => {

                it('a single media type', () => {
                    // given
                    @decorator('test')
                    class TestClass { }
                    // when
                    let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                    // expect
                    expect(endpointInfo).not.toBeUndefined();
                    expect(endpointValue(endpointInfo)).toEqual(new Set<string|Function>(['test']));
                });

                it('multiple media types', () => {
                    // given
                    @decorator('test1', 'test2')
                    class TestClass { }
                    // when
                    let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                    // expect
                    expect(endpointInfo).not.toBeUndefined();
                    expect(endpointValue(endpointInfo)).toEqual(new Set<string|Function>(['test1', 'test2']));
                });

                it('multiple media types over multiple decorators', () => {
                    // given
                    @decorator('test1')
                    @decorator('test2')
                    class TestClass { }
                    // when
                    let endpointInfo: EndpointInfo = getEndpointInfo(TestClass);
                    // expect
                    expect(endpointInfo).not.toBeUndefined();
                    expect(endpointValue(endpointInfo)).toEqual(new Set<string|Function>(['test1', 'test2']));
                });

            });

            describe('a method with', () => {

                it('a single media type', () => {
                    // given
                    class TestClass {
                        @decorator('test')
                        testMethod(): void { /* empty */ }
                    }
                    // when
                    let operationInfo: OperationInfo = getMergedOperationInfo(new TestClass(), 'testMethod');
                    // expect
                    expect(operationInfo).not.toBeUndefined();
                    expect(operationValue(operationInfo)).toEqual(new Set<string|Function>(['test']));
                });

                it('multiple media types', () => {
                    // given
                    class TestClass {
                        @decorator('test1', 'test2')
                        testMethod(): void { /* empty */ }
                    }
                    // when
                    let operationInfo: OperationInfo = getMergedOperationInfo(new TestClass(), 'testMethod');
                    // expect
                    expect(operationInfo).not.toBeUndefined();
                    expect(operationValue(operationInfo)).toEqual(new Set<string|Function>(['test1', 'test2']));
                });

                it('multiple media types over multiple decorators', () => {
                    // given
                    class TestClass {
                        @decorator('test1')
                        @decorator('test2')
                        testMethod(): void { /* empty */ }
                    }
                    // when
                    let operationInfo: OperationInfo = getMergedOperationInfo(new TestClass(), 'testMethod');
                    // expect
                    expect(operationInfo).not.toBeUndefined();
                    expect(operationValue(operationInfo)).toEqual(new Set<string|Function>(['test1', 'test2']));
                });

            });

            it('a class and a method', () => {
                // given
                @decorator('test1')
                class TestClass {
                    @decorator('test2')
                    testMethod(): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getMergedOperationInfo(new TestClass(), 'testMethod');
                // expect
                expect(operationInfo).not.toBeUndefined();
                expect(operationValue(operationInfo)).toEqual(new Set<string|Function>(['test1', 'test2']));
            });

        });

        describe('throws an exception when', () => {

            it('used on a static method', () => {
                // expect
                expect(() => {
                    class TestClass {
                        @decorator('test')
                        static staticMethod(): void { /* empty */ }
                    }
                }).toThrowError(/decorator cannot be used on a static method/);
            });

        });

    });

}

const decoratorInfos: DecoratorInfo[] = [
    {name: 'Consumes', decorator: Consumes, endpointValue: endpointInfo => endpointInfo.consumedMediaTypes, operationValue: operationInfo => operationInfo.consumedMediaTypes},
    {name: 'Produces', decorator: Produces, endpointValue: endpointInfo => endpointInfo.producedMediaTypes, operationValue: operationInfo => operationInfo.producedMediaTypes}
];
decoratorInfos.forEach(createResourceTypeSpecification);
