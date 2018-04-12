import {ClassOrMethodDecorator, throwInvalidDecoratorUsage} from './helper';
import {HttpMethod} from '../http';
import {OperationInfoBuilder, EndpointInfoBuilder} from '../metadata';

/**
 * Create an HTTP method decorator
 * @param decoratorName Decorator name
 * @param httpMethod    HTTP method
 * @return HTTP method decorator
 */
function createHttpMethodDecorator(decoratorName: string, httpMethod: HttpMethod): ClassOrMethodDecorator {
    return (target, propertyKey) => {
        if (target instanceof Function) {
            if (propertyKey !== undefined) {
                throwInvalidDecoratorUsage(target, propertyKey, 'the @' + decoratorName + ' decorator cannot be used on a static method');
            }

            EndpointInfoBuilder.of(target).method(httpMethod);
        } else {
            OperationInfoBuilder.of(target, propertyKey).method(httpMethod);
        }
    };
}

const DELETE: ClassOrMethodDecorator = createHttpMethodDecorator('DELETE', HttpMethod.DELETE);
const GET: ClassOrMethodDecorator = createHttpMethodDecorator('GET', HttpMethod.GET);
const HEAD: ClassOrMethodDecorator = createHttpMethodDecorator('HEAD', HttpMethod.HEAD);
const OPTIONS: ClassOrMethodDecorator = createHttpMethodDecorator('OPTIONS', HttpMethod.OPTIONS);
const PATCH: ClassOrMethodDecorator = createHttpMethodDecorator('PATCH', HttpMethod.PATCH);
const POST: ClassOrMethodDecorator = createHttpMethodDecorator('POST', HttpMethod.POST);
const PUT: ClassOrMethodDecorator = createHttpMethodDecorator('PUT', HttpMethod.PUT);

export {
    DELETE,
    GET,
    HEAD,
    OPTIONS,
    PATCH,
    POST,
    PUT
};
