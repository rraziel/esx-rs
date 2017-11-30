import {HttpMethod} from '../http-method';
import {OperationInfo} from './operation-info';
import {OperationInfoMetadata} from './operation-info-metadata';
import {OperationParameterInfo} from './operation-parameter-info';
import {OperationParameterType} from './operation-parameter-type';
import 'reflect-metadata';

/**
 * Operation information builder
 */
class OperationInfoBuilder {
    private propertyKey: string|symbol;
    private target: Object;

    /**
     * Class constructor
     * @param target      Class prototype
     * @param propertyKey Property key
     */
    private constructor(target: Object, propertyKey: string|symbol) {
        this.target = target;
        this.propertyKey = propertyKey;
    }

    /**
     * Add a supported HTTP method
     * @param httpMethod HTTP method
     */
    method(httpMethod: HttpMethod): OperationInfoBuilder {
        return this.update(operationInfo => {
            let httpMethods: HttpMethod[] = operationInfo.httpMethods = operationInfo.httpMethods || [];
            httpMethods.push(httpMethod);
        });
    }

    /**
     * Set the resource path
     * @param resourcePath Resoure path
     * @return this
     */
    path(resourcePath: string): OperationInfoBuilder {
        return this.update(operationInfo => operationInfo.resourcePath = resourcePath);
    }

    /**
     * Add a supported consumed type
     * @param mediaType Media type as a string or as a class
     * @param <T>       Constructor type
     * @return this
     */
    consumes<T extends Function>(mediaType: string|T): OperationInfoBuilder {
        return this.update(operationInfo => {
            let consumedMediaTypes: (string|Function)[] = operationInfo.consumedMediaTypes = operationInfo.consumedMediaTypes || [];
            consumedMediaTypes.push(mediaType);
        });
    }

    /**
     * Add a supported produced type
     * @param mediaType Media type as a string or as a class
     * @param <T>       Constructor type
     * @return this
     */
    produces<T extends Function>(mediaType: string|T): OperationInfoBuilder {
        return this.update(operationInfo => {
            let producedMediaTypes: (string|Function)[] = operationInfo.producedMediaTypes = operationInfo.producedMediaTypes || [];
            producedMediaTypes.push(mediaType);
        });
    }

    /**
     * Set a parameter's type
     * @param parameterIndex Parameter index
     * @param parameterType  Parameter type
     * @param parameterClass Parameter class
     * @param parameterName  Parameter name
     */
    parameter(parameterIndex: number, parameterType: OperationParameterType, parameterClass: Function, parameterName?: string): OperationInfoBuilder {
        return this.update(operationInfo => {
            let parameters: OperationParameterInfo[] = operationInfo.parameters = operationInfo.parameters || [];

            while (!(parameterIndex < parameters.length)) {
                parameters.push(null);
            }

            parameters[parameterIndex] = {
                name: parameterName,
                class: parameterClass,
                type: parameterType
            };
        });
    }

    /**
     * Manipulate an operation information
     * @param callback Callback
     * @return this
     */
    private update(callback: (operationInfo: OperationInfo) => void): OperationInfoBuilder {
        let operationInfo: OperationInfo = Reflect.getMetadata(OperationInfoMetadata, this.target, this.propertyKey) || {};
        callback(operationInfo);
        Reflect.defineMetadata(OperationInfoMetadata, operationInfo, this.target, this.propertyKey);
        return this;
    }

    /**
     * Get an operation information builder for the specified class
     * @param target      Class prototype
     * @param propertyKey Property key
     * @return Operation information builder
     */
    static of(target: Object, propertyKey: string|symbol): OperationInfoBuilder {
        return new OperationInfoBuilder(target, propertyKey);
    }

}

export {
    OperationInfoBuilder
};
