
/**
 * Class utility functions
 */
class ClassUtils {

    /**
     * Get the method names from an instance prototype
     * @param instancePrototype Instance prototype
     * @return List of method names
     */
    static getMethodNames(instancePrototype: Object): Array<string> {
        let methodNames: Array<string> = [];

        for (let p: Object = instancePrototype; p && p !== Object.prototype; p = Object.getPrototypeOf(p)) {
            Object.getOwnPropertyNames(p)
                .filter(propertyName => propertyName !== 'constructor')
                .filter(propertyName => ClassUtils.hasMethod(p, propertyName))
                .forEach(methodName => methodNames.push(methodName))
            ;
        }

        return methodNames;
    }

    /**
     * Test whether an instance prototype has a method with the given name
     * @param instancePrototype Instance prototype
     * @param methodName        Method name
     * @return true if the instance prototype has a method with the given name
     */
    static hasMethod(instancePrototype: Object, methodName: string): boolean {
        let propertyDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(instancePrototype, methodName);
        return !!(propertyDescriptor && typeof(propertyDescriptor.value) === 'function');
    }

}

export {
    ClassUtils
};
