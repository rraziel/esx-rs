
/**
 * Decorator that is applicable to a class or a method
 */
type ClassOrMethodDecorator = <T>(target: Object|Function, propertyKey?: string|symbol, propertyDescription?: TypedPropertyDescriptor<T>) => void;

/**
 * Decorator that is application to a property or a parameter
 */
type PropertyOrParameterDecorator = (target: Object, propertyKey: string|symbol, parameterIndex?: number) => void;

/**
 * Throw an exception due to invalid usage of a decorator
 * @param target      Target
 * @param propertyKey Property key
 * @param message     Message
 */
function throwInvalidDecoratorUsage(target: Object|Function, propertyKey: string|symbol, message: string): void {
    let className: string = (<Function> target).name;
    let methodName: string = <string> propertyKey;
    throw new Error(message + ' (' + className + '.' + methodName + ')');
}

export {
    ClassOrMethodDecorator,
    PropertyOrParameterDecorator,
    throwInvalidDecoratorUsage
};
