import { ClassOrMethodDecorator, throwInvalidDecoratorUsage } from './helper';
import { EndpointInfoBuilder, OperationInfoBuilder } from '../metadata';

/**
 * Create a path decorator
 * @param resourcePath Resource path
 * @return Decorator
 */
function Path(resourcePath: string): ClassOrMethodDecorator {
    return (target, propertyKey) => {
        if (target instanceof Function) {
            if (propertyKey) {
                throwInvalidDecoratorUsage(target, propertyKey, 'the @Path decorator cannot be used on a static method');
            }

            EndpointInfoBuilder.of(target).path(resourcePath);
        } else {
            OperationInfoBuilder.of(target, propertyKey!).path(resourcePath);
        }
    };
}

export {
    Path
};
