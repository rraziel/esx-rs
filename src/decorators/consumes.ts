import {EndpointInfoBuilder, OperationInfoBuilder} from '../metadata';
import {ClassOrMethodDecorator, throwInvalidDecoratorUsage} from './helper';

/**
 * Create a Consumes decorator, declaring the content types supported by the operation
 * @param mediaTypes List of media types
 * @return Consumes decorator
 */
function Consumes(...mediaTypes: (string|Function)[]): ClassOrMethodDecorator {
    return (target, propertyKey, propertyDescription) => {
        if (target instanceof Function && propertyKey) {
            throwInvalidDecoratorUsage(target, propertyKey, 'the @Consumes decorator cannot be used on a static method');
        }

        if (target instanceof Function) {
            let endpointInfoBuilder: EndpointInfoBuilder<Function> = EndpointInfoBuilder.of(target);
            mediaTypes.forEach(mediaType => endpointInfoBuilder.consumes(mediaType));
        } else {
            let operationInfoBuilder: OperationInfoBuilder = OperationInfoBuilder.of(target, propertyKey);
            mediaTypes.forEach(mediaType => operationInfoBuilder = operationInfoBuilder.consumes(mediaType));
        }
    };
}

export {
    Consumes
};
