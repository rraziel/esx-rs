import {ClassOrMethodDecorator, throwInvalidDecoratorUsage} from './helper';
import {OperationInfoBuilder, EndpointInfoBuilder} from '../metadata';

/**
 * Create a decorator for an HTTP method
 * @param methodName Method name
 * @return HTTP method decorator
 */
function HttpMethod(methodName: string): ClassOrMethodDecorator {
    return (target, propertyKey) => {
        if (target instanceof Function) {
            if (propertyKey !== undefined) {
                throwInvalidDecoratorUsage(target, propertyKey, 'an HTTP method decorator cannot be used on a static method');
            }

            EndpointInfoBuilder.of(target).method(methodName);
        } else {
            OperationInfoBuilder.of(target, propertyKey).method(methodName);
        }
    };
}

const DELETE: ClassOrMethodDecorator = HttpMethod('DELETE');
const GET: ClassOrMethodDecorator = HttpMethod('GET');
const HEAD: ClassOrMethodDecorator = HttpMethod('HEAD');
const OPTIONS: ClassOrMethodDecorator = HttpMethod('OPTIONS');
const PATCH: ClassOrMethodDecorator = HttpMethod('PATCH');
const POST: ClassOrMethodDecorator = HttpMethod('POST');
const PUT: ClassOrMethodDecorator = HttpMethod('PUT');


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
