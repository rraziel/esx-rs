import {ClassOrMethodDecorator, throwInvalidDecoratorUsage} from './helper';
import {OperationInfoBuilder, EndpointInfoBuilder} from '../metadata';

const HTTP_METHOD_DELETE: string = 'DELETE';
const HTTP_METHOD_GET: string = 'GET';
const HTTP_METHOD_HEAD: string = 'HEAD';
const HTTP_METHOD_OPTIONS: string = 'OPTIONS';
const HTTP_METHOD_PATCH: string = 'PATCH';
const HTTP_METHOD_POST: string = 'POST';
const HTTP_METHOD_PUT: string = 'PUT';

/**
 * Create an HTTP method decorator
 * @param decoratorName Decorator name
 * @param methodName    HTTP method name
 * @return HTTP method decorator
 */
function createHttpMethodDecorator(decoratorName: string, methodName: string): ClassOrMethodDecorator {
    return (target, propertyKey) => {
        if (target instanceof Function) {
            if (propertyKey !== undefined) {
                throwInvalidDecoratorUsage(target, propertyKey, 'the @' + decoratorName + ' decorator cannot be used on a static method');
            }

            EndpointInfoBuilder.of(target).method(methodName);
        } else {
            OperationInfoBuilder.of(target, propertyKey).method(methodName);
        }
    };
}

const DELETE: ClassOrMethodDecorator = createHttpMethodDecorator('DELETE', HTTP_METHOD_DELETE);
const GET: ClassOrMethodDecorator = createHttpMethodDecorator('GET', HTTP_METHOD_GET);
const HEAD: ClassOrMethodDecorator = createHttpMethodDecorator('HEAD', HTTP_METHOD_HEAD);
const OPTIONS: ClassOrMethodDecorator = createHttpMethodDecorator('OPTIONS', HTTP_METHOD_OPTIONS);
const PATCH: ClassOrMethodDecorator = createHttpMethodDecorator('PATCH', HTTP_METHOD_PATCH);
const POST: ClassOrMethodDecorator = createHttpMethodDecorator('POST', HTTP_METHOD_POST);
const PUT: ClassOrMethodDecorator = createHttpMethodDecorator('PUT', HTTP_METHOD_PUT);

/**
 * Create a decorator for a custom HTTP method
 * @param methodName Method name
 * @return HTTP method decorator
 */
function HttpMethod(methodName: string): ClassOrMethodDecorator {
    return createHttpMethodDecorator('HttpMethod', methodName);
}

export {
    DELETE,
    GET,
    HEAD,
    HttpMethod,
    OPTIONS,
    PATCH,
    POST,
    PUT
};
