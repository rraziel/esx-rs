import {ContextParam, CookieParam, FormParam, HeaderParam, MatrixParam, PathParam, QueryParam} from './param';
import {PropertyOrParameterDecorator} from './helper';
import {getMergedOperationInfo, getPropertyInfo, OperationInfo, ParameterType, PropertyInfo} from '../metadata';

class DecoratorInfo {
    name: string;
    decorator: (parameterName?: string) => PropertyOrParameterDecorator;
    type: ParameterType;
}

class ContextClass {}

describe('@ContextParam decorator', () => {

    describe('can be used on', () => {

        it('a method parameter', () => {
            // given
            class TestClass {
                testMethod(@ContextParam(ContextClass) p: ContextClass): void { /* empty */ }
            }
            // when
            let operationInfo: OperationInfo = getMergedOperationInfo(new TestClass(), 'testMethod');
            // then
            expect(operationInfo).not.toBeUndefined();
            expect(operationInfo.parameters).not.toBeUndefined();
            expect(operationInfo.parameters[0]).not.toBeUndefined();
            expect(operationInfo.parameters[0].type).toEqual(ParameterType.CONTEXT);
            expect(operationInfo.parameters[0].name).toEqual(ContextClass);
            expect(operationInfo.parameters[0].class).toEqual(ContextClass);
        });

        it('a resource property', () => {
            // given
            class TestClass {
                @ContextParam(ContextClass) f: ContextClass;
            }
            // when
            let propertyInfo: PropertyInfo = getPropertyInfo(new TestClass(), 'f');
            // then
            expect(propertyInfo).not.toBeUndefined();
            expect(propertyInfo.type).toEqual(ParameterType.CONTEXT);
            expect(propertyInfo.name).toEqual(ContextClass);
            expect(propertyInfo.class).toEqual(ContextClass);
        });

    });

    describe('throws an exception when', () => {

        it('used on a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    static staticMethod(@ContextParam(ContextClass) p: any): void { /* empty */ }
                }
            }).toThrowError(/decorator cannot be used on a static method/);
        });

    });

});

function createParameterSpecification(decoratorInfo: DecoratorInfo): void {
    let name: string = decoratorInfo.name;
    let decorator: (parameterName?: string) => PropertyOrParameterDecorator = decoratorInfo.decorator;
    let type: ParameterType = decoratorInfo.type;

    describe('@' + name + ' decorator', () => {

        describe('can be used on', () => {

            it ('a method parameter', () => {
                // given
                class TestClass {
                    testMethod(@decorator('test') p: string): void { /* empty */ }
                }
                // when
                let operationInfo: OperationInfo = getMergedOperationInfo(new TestClass(), 'testMethod');
                // then
                expect(operationInfo).not.toBeUndefined();
                expect(operationInfo.parameters).not.toBeUndefined();
                expect(operationInfo.parameters[0]).not.toBeUndefined();
                expect(operationInfo.parameters[0].type).toEqual(type);
                expect(operationInfo.parameters[0].name).toEqual('test');
                expect(operationInfo.parameters[0].class).toEqual(String);
            });

            it('a resource property', () => {
                // given
                class TestClass {
                    @decorator('test') f: string;
                }
                // when
                let propertyInfo: PropertyInfo = getPropertyInfo(new TestClass(), 'f');
                // then
                expect(propertyInfo).not.toBeUndefined();
                expect(propertyInfo.type).toEqual(type);
                expect(propertyInfo.name).toEqual('test');
                expect(propertyInfo.class).toEqual(String);
            });

        });

        describe('throws an exception when', () => {

            it('used on a static method', () => {
                // expect
                expect(() => {
                    class TestClass {
                        static staticMethod(@decorator('test') p: string): void { /* empty */ }
                    }
                }).toThrowError(/decorator cannot be used on a static method/);
            });

        });

    });

}

const decoratorInfos: DecoratorInfo[] = [
    {name: 'CookieParam', decorator: CookieParam, type: ParameterType.COOKIE},
    {name: 'FormParam', decorator: FormParam, type: ParameterType.FORM},
    {name: 'HeaderParam', decorator: HeaderParam, type: ParameterType.HEADER},
    {name: 'MatrixParam', decorator: MatrixParam, type: ParameterType.MATRIX},
    {name: 'PathParam', decorator: PathParam, type: ParameterType.PATH},
    {name: 'QueryParam', decorator: QueryParam, type: ParameterType.QUERY}
];
decoratorInfos.forEach(createParameterSpecification);
