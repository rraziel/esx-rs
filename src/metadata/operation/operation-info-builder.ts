import {HttpMethod} from '../../http';
import {ClassConstructor} from '../../utils';
import {getOperationInfo, setOperationInfo, OperationInfo} from './operation-info';
import {OperationParameterInfo} from './operation-parameter-info';
import {ParameterType} from '../parameter-type';

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
            let httpMethods: Set<HttpMethod> = operationInfo.httpMethods = operationInfo.httpMethods || new Set<HttpMethod>();
            httpMethods.add(httpMethod);
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
            let consumedMediaTypes: Set<string|Function> = operationInfo.consumedMediaTypes = operationInfo.consumedMediaTypes || new Set<string>();
            consumedMediaTypes.add(mediaType);
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
            let producedMediaTypes: Set<string|Function> = operationInfo.producedMediaTypes = operationInfo.producedMediaTypes || new Set<string>();
            producedMediaTypes.add(mediaType);
        });
    }

    /**
     * Set a parameter's type
     * @param parameterIndex Parameter index
     * @param parameterType  Parameter type
     * @param parameterClass Parameter class
     * @param parameterName  Parameter name
     */
    parameter(parameterIndex: number, parameterType: ParameterType, parameterClass: Function, parameterName?: string|ClassConstructor<any>): OperationInfoBuilder {
        return this.update(operationInfo => {
            operationInfo.parameters[parameterIndex] = {
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
        let operationInfo: OperationInfo = getOperationInfo(this.target, this.propertyKey);
        callback(operationInfo);
        setOperationInfo(this.target, this.propertyKey, operationInfo);
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
