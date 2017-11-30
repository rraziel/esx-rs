import {EndpointInfoBuilder, OperationInfoBuilder} from '../metadata';
import {ClassOrMethodDecorator, throwInvalidDecoratorUsage} from './helper';

type EndpointCallback = (endpointInfoBuilder: EndpointInfoBuilder<Function>, mediaType: string|Function) => void;
type OperationCallback = (operationInfoBuilder: OperationInfoBuilder, mediaType: string|Function) => void;

/**
 * Create a resource type decorator
 * @param decoratorName     Decorator name
 * @param endpointCallback  Endpoint callback
 * @param operationCallback Operation callback
 * @param mediaTypes        List of media types
 * @return Decorator
 */
function createResourceTypeDecorator(decoratorName: string, endpointCallback: EndpointCallback, operationCallback: OperationCallback, ...mediaTypes: (string|Function)[]): ClassOrMethodDecorator {
    return (target, propertyKey, propertyDescription) => {
        if (target instanceof Function && propertyKey) {
            throwInvalidDecoratorUsage(target, propertyKey, 'the @' + decoratorName + ' decorator cannot be used on a static method');
        }

        if (target instanceof Function) {
            let endpointInfoBuilder: EndpointInfoBuilder<Function> = EndpointInfoBuilder.of(target);
            mediaTypes.forEach(mediaType => endpointCallback(endpointInfoBuilder, mediaType));
        } else {
            let operationInfoBuilder: OperationInfoBuilder = OperationInfoBuilder.of(target, propertyKey);
            mediaTypes.forEach(mediaType => operationCallback(operationInfoBuilder, mediaType));
        }
    };
}

/**
 * Create a Consumes decorator, declaring the content types supported by the operation
 * @param mediaTypes List of media types
 * @return Consumes decorator
 */
function Consumes(...mediaTypes: (string|Function)[]): ClassOrMethodDecorator {
    return createResourceTypeDecorator(
        'Consumes',
        (endpointBuilder, mediaType) => endpointBuilder.consumes(mediaType),
        (operationBuilder, mediaType) => operationBuilder.consumes(mediaType),
        ...mediaTypes
    );
}

/**
 * Create a Produces decorator, declaring the accept types supported by the operation
 * @param mediaTypes List of media types
 * @return Produces decorator
 */
function Produces(...mediaTypes: (string|Function)[]): ClassOrMethodDecorator {
    return createResourceTypeDecorator(
        'Produces',
        (endpointBuilder, mediaType) => endpointBuilder.produces(mediaType),
        (operationBuilder, mediaType) => operationBuilder.produces(mediaType),
        ...mediaTypes
    );
}

export {
    Consumes,
    Produces
};
