import {PropertyOrParameterDecorator, throwInvalidDecoratorUsage} from './helper';

/**
 * Create a QueryParam decorator, declaring the path parameter bound to a method parameter or to a class property
 * @param parameterName Parameter name
 * @return QueryParam decorator
 */
function QueryParam(parameterName: string): PropertyOrParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        if (target instanceof Function) {
            throwInvalidDecoratorUsage(target, propertyKey, 'the @QueryParam decorator cannot be used on a static method or property');
        }

        if (parameterIndex !== undefined) {
            // Parameter
        } else {
            // Field
        }
    };
}

export {
    QueryParam
};
