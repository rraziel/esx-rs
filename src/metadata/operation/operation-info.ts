import {getEndpointInfo, EndpointInfo} from '../endpoint';
import {HttpMethod} from '../../http';
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
    parameters?: OperationParameterInfo[];
}

/**
 * Merge HTTP methods
 * @param operationInfo Operation information
 * @param endpointInfo  Endpoint information
 * @return Merged operation information
 */
function mergeHttpMethods(operationInfo: OperationInfo, endpointInfo: EndpointInfo): OperationInfo {
    if (endpointInfo.httpMethods) {
        operationInfo.httpMethods = operationInfo.httpMethods || [];
        endpointInfo.httpMethods.forEach(httpMethod => operationInfo.httpMethods.push(httpMethod));
    }

    return operationInfo;
}

/**
 * Merge resource paths
 * @param operationInfo Operation information
 * @param endpointInfo  Endpoint information
 * @return Merged operation information
 */
function mergeResourcePaths(operationInfo: OperationInfo, endpointInfo: EndpointInfo): OperationInfo {
    if (endpointInfo.resourcePath) {
        operationInfo.resourcePath = endpointInfo.resourcePath + operationInfo.resourcePath;
    }

    return operationInfo;
}

/**
 * Merge consumed media types
 * @param operationInfo Operation information
 * @param endpointInfo  Endpoint information
 * @return Merged operation information
 */
function mergeConsumedMediaTypes(operationInfo: OperationInfo, endpointInfo: EndpointInfo): OperationInfo {
    if (endpointInfo.consumedMediaTypes) {
        operationInfo.consumedMediaTypes = operationInfo.consumedMediaTypes || [];
        endpointInfo.consumedMediaTypes.forEach(consumedMediaType => operationInfo.consumedMediaTypes.push(consumedMediaType));
    }

    return operationInfo;
}

/**
 * Merge produced media types
 * @param operationInfo Operation information
 * @param endpointInfo  Endpoint information
 * @return Merged operation information
 */
function mergeProducedMediaTypes(operationInfo: OperationInfo, endpointInfo: EndpointInfo): OperationInfo {
    if (endpointInfo.producedMediaTypes) {
        operationInfo.producedMediaTypes = operationInfo.producedMediaTypes || [];
        endpointInfo.producedMediaTypes.forEach(producedMediaTypes => operationInfo.producedMediaTypes.push(producedMediaTypes));
    }

    return operationInfo;
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

    operationInfo = mergeHttpMethods(operationInfo, endpointInfo);
    operationInfo = mergeResourcePaths(operationInfo, endpointInfo);
    operationInfo = mergeConsumedMediaTypes(operationInfo, endpointInfo);
    operationInfo = mergeProducedMediaTypes(operationInfo, endpointInfo);

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
    OperationInfo,
    getOperationInfo
};
