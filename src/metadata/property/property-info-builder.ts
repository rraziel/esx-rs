import {getPropertyInfo, setPropertyInfo, PropertyInfo} from './property-info';
import {ParameterType} from '../parameter-type';
import {ClassConstructor} from '../../utils';

/**
 * Property information builder
 */
class PropertyInfoBuilder {
    private propertyKey: string|symbol;
    private target: Object;

    /**
     * Class constructor
     * @param target      Target
     * @param propertyKey Property key
     */
    private constructor(target: Object, propertyKey: string|symbol) {
        this.target = target;
        this.propertyKey = propertyKey;
    }

    /**
     * Set a parameter's type
     * @param parameterType  Parameter type
     * @param parameterClass Parameter class
     * @param parameterName  Parameter name
     * @return this
     */
    set(parameterType: ParameterType, parameterClass: Function, parameterName?: string|ClassConstructor<any>): PropertyInfoBuilder {
        return this.update(propertyInfo => {
            propertyInfo.name = parameterName;
            propertyInfo.class = parameterClass;
            propertyInfo.type = parameterType;
        });
    }

    /**
     * Manipulate a property information
     * @param callback Callback
     * @return this
     */
    private update(callback: (propertyInfo: PropertyInfo) => void): PropertyInfoBuilder {
        let propertyInfo: PropertyInfo = getPropertyInfo(this.target, this.propertyKey) || {};
        callback(propertyInfo);
        setPropertyInfo(this.target, this.propertyKey, propertyInfo);
        return this;
    }

    /**
     * Get a property information builder for a specified class property
     * @param target         Target
     * @param propertyKey    Property key
     * @return Property information builder
     */
    static of(target: Object, propertyKey: string|symbol): PropertyInfoBuilder {
        return new PropertyInfoBuilder(target, propertyKey);
    }

}

export {
    PropertyInfoBuilder
};
