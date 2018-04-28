import {PropertyOrParameterDecorator, throwInvalidDecoratorUsage} from './helper';
import {OperationInfoBuilder, ParameterType, PropertyInfoBuilder} from '../metadata';
import {ClassConstructor, TypeUtils} from 'es-decorator-utils';

/**
 * Get a method parameter class
 * @param target         Target
 * @param propertyKey    Property key
 * @param parameterIndex Parameter index
 * @return Parameter class
 */
function getMethodParameterClass(target: Object, propertyKey: string|symbol, parameterIndex: number): Function {
    let parameterClasses: Function[] = TypeUtils.getParameterClasses(<ClassConstructor<any>> target.constructor, propertyKey);
    return parameterClasses[parameterIndex];
}

/**
 * Get a resource property class
 * @param target      Target
 * @param propertyKey Property key
 * @return Property class
 */
function getResourcePropertyClass(target: Object, propertyKey: string|symbol): Function {
    let propertyClass: Function = TypeUtils.getPropertyClass(<ClassConstructor<any>> target.constructor, propertyKey);
    return propertyClass;
}

/**
 * Create a parameter decorator
 * @param decoratorName Decorator name
 * @param parameterType Parameter type
 * @param parameterName Parameter name
 */
function createParameterDecorator(decoratorName: string, parameterType: ParameterType, parameterName?: string|ClassConstructor<any>): PropertyOrParameterDecorator {
    return (target, propertyKey, parameterIndex) => {
        if (target instanceof Function) {
            throwInvalidDecoratorUsage(target, propertyKey, 'the @' + decoratorName + ' decorator cannot be used on a static method or property');
        }

        if (parameterIndex !== undefined) {
            let parameterClass: Function = getMethodParameterClass(target, propertyKey, parameterIndex);
            OperationInfoBuilder.of(target, propertyKey).parameter(parameterIndex, parameterType, parameterClass, parameterName);
        } else {
            let propertyClass: Function = getResourcePropertyClass(target, propertyKey);
            PropertyInfoBuilder.of(target, propertyKey).set(parameterType, propertyClass, parameterName);
        }
    };
}

/**
 * Create a ContextParam decorator, declaring the class of the context information bound to a method parameter or to a class property
 * @param contextClass Context class
 * @return ContextParam decorator
 */
function ContextParam(contextClass: ClassConstructor<any>): PropertyOrParameterDecorator {
    return createParameterDecorator('ContextParam', ParameterType.CONTEXT, contextClass);
}

/**
 * Create a CookieParam decorator, declaring the cookie parameter bound to a method parameter or to a class property
 * @param parameterName Parameter name
 * @return CookieParam decorator
 */
function CookieParam(parameterName?: string): PropertyOrParameterDecorator {
    return createParameterDecorator('CookieParam', ParameterType.COOKIE, parameterName);
}

/**
 * Create a FormParam decorator, declaring the form parameter bound to a method parameter or to a class property
 * @param parameterName Parameter name
 * @return FormParam decorator
 */
function FormParam(parameterName?: string): PropertyOrParameterDecorator {
    return createParameterDecorator('FormParam', ParameterType.FORM, parameterName);
}

/**
 * Create a HeaderParam decorator, declaring the header parameter bound to a method parameter or to a class property
 * @param parameterName Parameter name
 * @return HeaderParam decorator
 */
function HeaderParam(parameterName?: string): PropertyOrParameterDecorator {
    return createParameterDecorator('HeaderParam', ParameterType.HEADER, parameterName);
}

/**
 * Create a MatrixParam decorator, declaring the matrix parameter bound to a method parameter or to a class property
 * @param parameterName Parameter name
 * @return MatrixParam decorator
 */
function MatrixParam(parameterName: string): PropertyOrParameterDecorator {
    return createParameterDecorator('MatrixParam', ParameterType.MATRIX, parameterName);
}

/**
 * Create a PathParam decorator, declaring the path parameter bound to a method parameter or to a class property
 * @param parameterName Parameter name
 * @return PathParam decorator
 */
function PathParam(parameterName: string): PropertyOrParameterDecorator {
    return createParameterDecorator('PathParam', ParameterType.PATH, parameterName);
}

/**
 * Create a QueryParam decorator, declaring the path parameter bound to a method parameter or to a class property
 * @param parameterName Parameter name
 * @return QueryParam decorator
 */
function QueryParam(parameterName?: string): PropertyOrParameterDecorator {
    return createParameterDecorator('QueryParam', ParameterType.QUERY, parameterName);
}

export {
    ContextParam,
    CookieParam,
    FormParam,
    HeaderParam,
    MatrixParam,
    PathParam,
    QueryParam
};
