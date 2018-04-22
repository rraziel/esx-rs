import {TypeUtils} from './type-utils';
import {ClassConstructor} from './class-constructor';

const DummyClass: ClassDecorator = () => { /* empty */ };
const DummyMethod: MethodDecorator = () => { /* empty */ };
const DummyProperty: PropertyDecorator = () => { /* empty */ };

describe('Type utility functions', () => {

    it('can get a property class', () => {
        // given
        class TestPropertyClass { }
        class TestClass {
            @DummyProperty prop1: number;
            @DummyProperty prop2: string;
            @DummyProperty prop3: TestPropertyClass;
        }
        // when
        let prop1Class: ClassConstructor<any> = TypeUtils.getPropertyClass(TestClass, 'prop1');
        let prop2Class: ClassConstructor<any> = TypeUtils.getPropertyClass(TestClass, 'prop2');
        let prop3Class: ClassConstructor<any> = TypeUtils.getPropertyClass(TestClass, 'prop3');
        // then
        expect(prop1Class).toEqual(Number);
        expect(prop2Class).toEqual(String);
        expect(prop3Class).toEqual(TestPropertyClass);
    });

    it('can get a constructor parameter class', () => {
        // given
        class TestParameterClass { }
        @DummyClass
        class TestClass {
            constructor(p0: number, p1: string, p2: TestParameterClass) { /* empty */ }
        }
        // when
        let param0Class: ClassConstructor<any> = TypeUtils.getParameterClass(TestClass, undefined, 0);
        let param1Class: ClassConstructor<any> = TypeUtils.getParameterClass(TestClass, undefined, 1);
        let param2Class: ClassConstructor<any> = TypeUtils.getParameterClass(TestClass, undefined, 2);
        // then
        expect(param0Class).toEqual(Number);
        expect(param1Class).toEqual(String);
        expect(param2Class).toEqual(TestParameterClass);
    });

    it('can get a method parameter class', () => {
        // given
        class TestParameterClass { }
        class TestClass {
            @DummyMethod method(p0: number, p1: string, p2: TestParameterClass): void { /* empty */ }
        }
        // when
        let param0Class: ClassConstructor<any> = TypeUtils.getParameterClass(TestClass, 'method', 0);
        let param1Class: ClassConstructor<any> = TypeUtils.getParameterClass(TestClass, 'method', 1);
        let param2Class: ClassConstructor<any> = TypeUtils.getParameterClass(TestClass, 'method', 2);
        // then
        expect(param0Class).toEqual(Number);
        expect(param1Class).toEqual(String);
        expect(param2Class).toEqual(TestParameterClass);
    });

    it('can get a method return class', () => {
        // given
        class TestReturnClass { }
        class TestClass {
            @DummyMethod method(): TestReturnClass { return null; }
        }
        // when
        let returnClass: ClassConstructor<any> = TypeUtils.getReturnClass(TestClass, 'method');
        // then
        expect(returnClass).toEqual(TestReturnClass);
    });

});
