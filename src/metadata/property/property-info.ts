import {ParameterType} from '../parameter-type';
import {ClassConstructor} from '../../utils';

/**
 * Property information metadata
 */
const PropertyInfoMetadata: Symbol = Symbol('esx-rs:property');

/**
 * Property information
 */
interface PropertyInfo {
    name?: string|ClassConstructor<any>;
    class?: Function;
    type?: ParameterType;
}

/**
 * Get property information
 * @param target      Class prototype
 * @param propertyKey Property key
 * @return Property information
 */
function getPropertyInfo(target: Object, propertyKey: string|symbol): PropertyInfo {
    let propertyInfo: PropertyInfo = Reflect.getMetadata(PropertyInfoMetadata, target, propertyKey) || {};
    return propertyInfo;
}

/**
 * Set method information
 * @param target       Class prototype
 * @param propertyKey  Property key
 * @param propertyInfo Property information
 */
function setPropertyInfo(target: Object, propertyKey: string|symbol, propertyInfo: PropertyInfo): void {
    Reflect.defineMetadata(PropertyInfoMetadata, propertyInfo, target, propertyKey);
}

export {
    PropertyInfo,
    getPropertyInfo,
    setPropertyInfo
};
