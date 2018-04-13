import {getResourceInfo, setResourceInfo, ResourceInfo} from './resource-info';
import {ParameterType} from '../parameter-type';
import {ClassConstructor} from '../../utils';

/**
 * Resource information builder
 * @param <C> Constructor type
 */
class ResourceInfoBuilder<C extends Function> {
    private propertyKey: string|symbol;
    private target: C;

    /**
     * Class constructor
     * @param target      Target
     * @param propertyKey Property key
     */
    private constructor(target: C, propertyKey?: string|symbol) {
        this.target = target;
        this.propertyKey = propertyKey;
    }

    /**
     * Update an endpoint information
     * @param callback Callback
     * @return this
     */
    private update(callback: (resourceInfo: ResourceInfo) => void): ResourceInfoBuilder<C> {
        let resourceInfo: ResourceInfo = getResourceInfo<C>(this.target) || {};
        callback(resourceInfo);
        setResourceInfo(this.target, resourceInfo);
        return this;
    }

    /**
     * Get an operation information builder for the specified class
     * @param target Class constructor
     * @return Operation information builder
     */
    static of<C extends Function>(target: C): ResourceInfoBuilder<C> {
        return new ResourceInfoBuilder(target);
    }

}

export {
    ResourceInfoBuilder
};
