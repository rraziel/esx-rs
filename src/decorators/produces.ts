import {EndpointInfoBuilder, OperationInfoBuilder} from '../metadata';
import {ClassOrMethodDecorator, throwInvalidDecoratorUsage} from './helper';

/**
 * Create a Produces decorator, declaring the accept types supported by the operation
 * @param mediaTypes List of media types
 * @return Produces decorator
 */
function Produces(...mediaTypes: (string|Function)[]): ClassOrMethodDecorator {
    return (target, propertyKey) => {
        if (target instanceof Function) {
            if (propertyKey) {
                throwInvalidDecoratorUsage(target, propertyKey, 'the @Produces decorator cannot be used on a static method');
            }

            let endpointInfoBuilder: EndpointInfoBuilder<Function> = EndpointInfoBuilder.of(target);
            mediaTypes.forEach(mediaType => endpointInfoBuilder.produces(mediaType));
        } else {
            let operationInfoBuilder: OperationInfoBuilder = OperationInfoBuilder.of(target, propertyKey);
            mediaTypes.forEach(mediaType => operationInfoBuilder.produces(mediaType));
        }
    };
}

export {
    Produces
};
