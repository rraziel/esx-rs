import {ContextParam, FormParam, HeaderParam, PathParam, QueryParam} from './param';
import {PropertyOrParameterDecorator} from './helper';
import {OperationParameterType} from '../metadata';

class DecoratorInfo {
    name: string;
    decorator: (parameterName?: string) => PropertyOrParameterDecorator;
    type: OperationParameterType;
}

class ContextClass {}

describe('@ContextParam decorator', () => {

    it('can be used on a method parameter', () => {
        // given
        class TestClass {
            testMethod(@ContextParam(ContextClass) p: any): void { /* empty */ }
        }
        // when
        // then
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
    let type: OperationParameterType = decoratorInfo.type;

    describe('@' + name + ' decorator', () => {

        it('can be used on a method parameter', () => {
            // given
            class TestClass {
                testMethod(@decorator('test') p: string): void { /* empty */ }
            }
            // when
            // then
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
    {name: 'FormParam', decorator: FormParam, type: OperationParameterType.FORM},
    {name: 'HeaderParam', decorator: HeaderParam, type: OperationParameterType.HEADER},
    {name: 'PathParam', decorator: PathParam, type: OperationParameterType.PATH},
    {name: 'QueryParam', decorator: QueryParam, type: OperationParameterType.QUERY}
];
decoratorInfos.forEach(createParameterSpecification);
