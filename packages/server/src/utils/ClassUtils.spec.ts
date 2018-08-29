import { ClassUtils } from './ClassUtils';

class TestClass {
    constructor() { /* empty */ }
    methodA(): void { /* empty */ }
    methodB(): void { /* empty */ }
}

class TestDerivedClass extends TestClass {
    constructor() { super(); }
    methodC(): void { /* empty */ }
    get methodD(): number { return 4; }
}

describe('Class utility functions', () => {

    it('can list all methods', () => {
        // given
        let instance: TestDerivedClass = new TestDerivedClass();
        let instancePrototype: Object = Object.getPrototypeOf(instance);
        // when
        let methodNames: string[] = ClassUtils.getMethodNames(instancePrototype);
        // then
        expect(methodNames).toEqual(expect.arrayContaining(['methodA', 'methodB', 'methodC']));
    });

    it('can test whether a method is present', () => {
        // given
        let instance: TestDerivedClass = new TestDerivedClass();
        let instancePrototype: Object = Object.getPrototypeOf(instance);
        // then
        expect(ClassUtils.hasMethod(instancePrototype, 'constructor')).toBe(true);
        expect(ClassUtils.hasMethod(instancePrototype, 'methodC')).toBe(true);
        expect(ClassUtils.hasMethod(instancePrototype, 'methodD')).toBe(false);
    });

});
