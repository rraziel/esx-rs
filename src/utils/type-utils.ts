import {ClassConstructor} from './class-constructor';
import 'reflect-metadata';

const METADATAKEY_PARAMETERTYPES: string = 'design:paramtypes';
const METADATAKEY_RETURNTYPE: string = 'design:returntype';
const METADATAKEY_TYPE: string = 'design:type';

/**
 * Type utility functions
 */
class TypeUtils {

    /**
     * Get a property class
     * @param typeClass    Type class
     * @param propertyName Property name
     * @param <T>          Type
     * @return Property class
     */
    static getPropertyClass<T>(typeClass: ClassConstructor<T>, propertyName: string|symbol): ClassConstructor<any> {
        let propertyClass: ClassConstructor<any> = Reflect.getMetadata(METADATAKEY_TYPE, typeClass.prototype, propertyName);
        return propertyClass;
    }

    /**
     * Get a method parameter class
     * @param target         Type class
     * @param methodName     Method name
     * @param parameterIndex Parameter index
     * @param <T>            Type
     * @return Parameter class
     */
    static getParameterClass<T>(typeClass: ClassConstructor<T>, methodName: string, parameterIndex: number): ClassConstructor<any> {
        let parameterClasses: ClassConstructor<any>[] = TypeUtils.getParameterClasses(typeClass, methodName);
        return parameterClasses && parameterClasses[parameterIndex];
    }

    /**
     * Get method parameters classes
     * @param typeClass  Type class
     * @param methodName Method name
     * @param <T>        Type
     * @return List of parameter classes
     */
    static getParameterClasses<T>(typeClass: ClassConstructor<T>, methodName?: string|symbol): ClassConstructor<any>[] {
        let parameterClasses: ClassConstructor<any>[];

        if (methodName === undefined) {
            parameterClasses = Reflect.getMetadata(METADATAKEY_PARAMETERTYPES, typeClass);
        } else {
            parameterClasses = Reflect.getMetadata(METADATAKEY_PARAMETERTYPES, typeClass.prototype, methodName);
        }

        return parameterClasses;
    }

    /**
     * Get a method's return class
     * @param typeClass  Type class
     * @param methodName Method name
     * @param <T>        Type
     * @return Method return class
     */
    static getReturnClass<T>(typeClass: ClassConstructor<T>, methodName: string|symbol): ClassConstructor<any> {
        return Reflect.getMetadata(METADATAKEY_RETURNTYPE, typeClass.prototype, methodName);
    }

}

export {
    TypeUtils
};
