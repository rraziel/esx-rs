import {getEndpointInfo, EndpointInfo} from '../endpoint';
import {HttpMethod} from '../../http';
import {OperationParameterInfo} from './operation-parameter-info';
import * as pathToRegexp from 'path-to-regexp';
import 'reflect-metadata';

/**
 * Operation information metadata
 */
const OperationInfoMetadata: Symbol = Symbol('esx-rs:operation');

/**
 * Operation information
 */
interface OperationInfo extends EndpointInfo {
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
        operationInfo.httpMethods = operationInfo.httpMethods || new Set<HttpMethod>();
        endpointInfo.httpMethods.forEach(httpMethod => operationInfo.httpMethods.add(httpMethod));
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
        operationInfo.consumedMediaTypes = operationInfo.consumedMediaTypes || new Set<string|Function>();
        endpointInfo.consumedMediaTypes.forEach(consumedMediaType => operationInfo.consumedMediaTypes.add(consumedMediaType));
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
        operationInfo.producedMediaTypes = operationInfo.producedMediaTypes || new Set<string|Function>();
        endpointInfo.producedMediaTypes.forEach(producedMediaTypes => operationInfo.producedMediaTypes.add(producedMediaTypes));
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
 * Get an operation information
 * @param target      Class prototype
 * @param propertyKey Property key
 * @return Operation information
 */
function getOperationInfo(target: Object, propertyKey: string|symbol): OperationInfo {
    let operationInfo: OperationInfo = Reflect.getMetadata(OperationInfoMetadata, target, propertyKey) || {};
    return operationInfo;
}

/**
 * Set an operation information
 * @param target        Class prototype
 * @param propertyKey   Property key
 * @param operationInfo Operation information
 * @return Operation information
 */
function setOperationInfo(target: Object, propertyKey: string|symbol, operationInfo: OperationInfo): void {
    Reflect.defineMetadata(OperationInfoMetadata, operationInfo, target, propertyKey);
}

/**
 * Finalize operation information
 * @param classPrototype Class prototype
 * @param methodName     Method name
 * @param operationInfo  Operation information
 * @return Finalized operation information
 */
function finalizeOperationInfo(classPrototype: Object, methodName: string, operationInfo: OperationInfo): OperationInfo {
    let endpointClass: Function = classPrototype.constructor;
    let endpointInfo: EndpointInfo = getEndpointInfo(endpointClass);

    operationInfo = mergeEndpointInfoIntoOperationInfo(operationInfo, endpointInfo);
    if (operationInfo.resourcePath) {
        operationInfo.resourcePathKeys = [];
        operationInfo.resourcePathRegExp = pathToRegexp(operationInfo.resourcePath, operationInfo.resourcePathKeys);
    }

    setOperationInfo(classPrototype, methodName, operationInfo);

    return operationInfo;
}

/**
 * Get full operation information for an instance's method
 * @param instance Instance
 * @param <T>      Instance type
 * @return Full operation information
 */
function getFullOperationInfo<T extends Object>(instance: T, methodName: string): OperationInfo {
    let classPrototype: Object = Object.getPrototypeOf(instance);
    let operationInfo: OperationInfo = getOperationInfo(classPrototype, methodName);
    if (operationInfo.resourcePathRegExp) {
        return operationInfo;
    }

    return finalizeOperationInfo(classPrototype, methodName, operationInfo);
}

export {
    OperationInfo,
    getFullOperationInfo,
    getOperationInfo,
    setOperationInfo
};
