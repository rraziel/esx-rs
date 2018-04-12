import {OperationParameterType} from '../operation/operation-parameter-type';
import {ClassConstructor} from '../../utils';

/**
 * Resource information builder
 */
class ResourceInfoBuilder {
    private propertyKey: string|symbol;
    private target: Object;

    /**
     * Class constructor
     * @param target      Target
     * @param propertyKey Property key
     */
    private constructor(target: Object, propertyKey?: string|symbol) {
        this.target = target;
        this.propertyKey = propertyKey;
    }

    /**
     * Set a property
     * @param propertyKey   Property key
     * @param parameterType Parameter type
     * @param propertyClass Property class
     * @param parameterName Parameter name
     */
    property(propertyKey: string|symbol, parameterType: OperationParameterType, propertyClass: Function, parameterName?: string|ClassConstructor<any>): ResourceInfoBuilder {
        return this;
    }

    /**
     * Get an operation information builder for the specified class
     * @param target      Class prototype
     * @param propertyKey Property key
     * @return Operation information builder
     */
    static of(target: Object, propertyKey?: string|symbol): ResourceInfoBuilder {
        return new ResourceInfoBuilder(target, propertyKey);
    }

}

export {
    ResourceInfoBuilder
};
