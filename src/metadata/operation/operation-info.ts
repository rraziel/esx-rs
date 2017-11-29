import {getEndpointInfo, EndpointInfo} from '../endpoint';
import {HttpMethod} from '../http-method';
import {OperationParameterInfo} from './operation-parameter-info';
import {OperationInfoMetadata} from './operation-info-metadata';
import 'reflect-metadata';

/**
 * Operation information
 */
interface OperationInfo {
    resourcePath?: string;
    httpMethods?: HttpMethod[];
    consumedMediaTypes?: string[];
    producedMediaTypes?: string[];
    bodyParameterIndex?: number;
    headerParameters?: {[parameterIndex: number]: string};
    pathParameters?: {[parameterIndex: number]: string};
    queryParameters?: {[parameterIndex: number]: string|Function};
}

/**
 * Merge endpoint information into operation information
 * @param operationInfo Operation information
 * @param endpointInfo  Endpoint information
 * @return Merged operation information
 */
function mergeEndpointInfoIntoOperationInfo(operationInfo: OperationInfo, endpointInfo: EndpointInfo): OperationInfo {
    if (!endpointInfo) {
        return operationInfo;
    }

    if (operationInfo === undefined) {
        operationInfo = {};
    }

    if (endpointInfo.httpMethods) {
        operationInfo.httpMethods = operationInfo.httpMethods || [];
        endpointInfo.httpMethods.forEach(httpMethod => operationInfo.httpMethods.push(httpMethod));
    }

    if (endpointInfo.resourcePath) {
        operationInfo.resourcePath = endpointInfo.resourcePath + operationInfo.resourcePath;
    }

    if (endpointInfo.consumedMediaTypes) {
        operationInfo.consumedMediaTypes = operationInfo.consumedMediaTypes || [];
        endpointInfo.consumedMediaTypes.forEach(consumedMediaType => operationInfo.consumedMediaTypes.push(consumedMediaType));
    }

    if (endpointInfo.producedMediaTypes) {
        operationInfo.producedMediaTypes = operationInfo.producedMediaTypes || [];
        endpointInfo.producedMediaTypes.forEach(producedMediaTypes => operationInfo.producedMediaTypes.push(producedMediaTypes));
    }

    return operationInfo;
}

/**
 * Get operation information for an instance's method
 * @param instance Instance
 * @param <T>      Instance type
 * @return Operation information
 */
function getOperationInfo<T extends Object>(instance: T, methodName: string): OperationInfo {
    let classPrototype: Object = Object.getPrototypeOf(instance);
    let operationInfo: OperationInfo = Reflect.getMetadata(OperationInfoMetadata, classPrototype, methodName);
    let endpointClass: Function = classPrototype.constructor;
    let endpointInfo: EndpointInfo = getEndpointInfo(endpointClass);
    return mergeEndpointInfoIntoOperationInfo(operationInfo, endpointInfo);
}

export {
    getOperationInfo,
    OperationInfo
};
