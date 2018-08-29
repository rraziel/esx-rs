import { getEndpointInfo, EndpointInfo } from '../endpoint';
import { OperationParameterInfo } from './OperationParameterInfo';
import { ParameterType } from '../ParameterType';
import { ClassConstructor, TypeUtils } from 'es-decorator-utils';
import 'reflect-metadata';

/**
 * Operation information metadata
 */
const OperationInfoMetadata: Symbol = Symbol('esx-rs:operation');

/**
 * Operation information
 */
class OperationInfo extends EndpointInfo {
    readonly parameters: Array<OperationParameterInfo> = [];
    readonly returnClass: ClassConstructor<any>|undefined;

    /**
     * Class constructor
     * @param returnClass Return class
     */
    constructor(returnClass?: ClassConstructor<any>) {
        super();
        this.returnClass = returnClass;
    }

}

/**
 * Merge HTTP methods
 * @param operationInfo Operation information
 * @param endpointInfo  Endpoint information
 * @return Merged operation information
 */
function mergeHttpMethods(operationInfo: OperationInfo, endpointInfo: EndpointInfo): OperationInfo {
    endpointInfo.httpMethods.forEach(httpMethod => operationInfo.httpMethods.add(httpMethod));
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
    endpointInfo.consumedMediaTypes.forEach(consumedMediaType => operationInfo.consumedMediaTypes.add(consumedMediaType));
    return operationInfo;
}

/**
 * Merge produced media types
 * @param operationInfo Operation information
 * @param endpointInfo  Endpoint information
 * @return Merged operation information
 */
function mergeProducedMediaTypes(operationInfo: OperationInfo, endpointInfo: EndpointInfo): OperationInfo {
    endpointInfo.producedMediaTypes.forEach(producedMediaTypes => operationInfo.producedMediaTypes.add(producedMediaTypes));
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

    operationInfo = mergeHttpMethods(operationInfo, endpointInfo);
    operationInfo = mergeResourcePaths(operationInfo, endpointInfo);
    operationInfo = mergeConsumedMediaTypes(operationInfo, endpointInfo);
    operationInfo = mergeProducedMediaTypes(operationInfo, endpointInfo);

    return operationInfo;
}

/**
 * Initialize operation information
 * @param endpointClassPrototype Endpoint class prototype
 * @param propertyKey            Property key
 * @return Operation information
 */
function initializeOperationInfo(endpointClassPrototype: Object, propertyKey: string|symbol): OperationInfo {
    let endpointClass: ClassConstructor<any> = <ClassConstructor<any>> endpointClassPrototype.constructor;
    let returnClass: ClassConstructor<any> = TypeUtils.getReturnClass(endpointClass, propertyKey);
    let operationInfo: OperationInfo = new OperationInfo(returnClass);

    let operationParameterInfos: Array<OperationParameterInfo> = TypeUtils.getParameterClasses(endpointClass, propertyKey)
        .map(parameterClass => new OperationParameterInfo(parameterClass, ParameterType.BODY))
    ;

    operationInfo.parameters.push(...operationParameterInfos);

    return operationInfo;
}

/**
 * Get an operation information
 * @param endpointClassPrototype Endpoint class prototype
 * @param propertyKey            Property key
 * @return Operation information
 */
function getOperationInfo(endpointClassPrototype: Object, propertyKey: string|symbol): OperationInfo {
    let operationInfo: OperationInfo = Reflect.getMetadata(OperationInfoMetadata, endpointClassPrototype, propertyKey);

    if (operationInfo === undefined) {
        operationInfo = initializeOperationInfo(endpointClassPrototype, propertyKey);
    }

    return operationInfo;
}

/**
 * Set an operation information
 * @param endpointClassPrototype Endpoint class prototype
 * @param propertyKey            Property key
 * @param operationInfo          Operation information
 */
function setOperationInfo(endpointClassPrototype: Object, propertyKey: string|symbol, operationInfo: OperationInfo): void {
    Reflect.defineMetadata(OperationInfoMetadata, operationInfo, endpointClassPrototype, propertyKey);
}

/**
 * Get full operation information, including merged endpoint information
 * @param target      Class prototype
 * @param propertyKey Property key
 * @return Full operation information
 */
function getFullOperationInfo(endpointClassPrototype: Object, methodName: string): OperationInfo {
    let operationInfo: OperationInfo = getOperationInfo(endpointClassPrototype, methodName);
    let endpointClass: Function = endpointClassPrototype.constructor;
    let endpointInfo: EndpointInfo = getEndpointInfo(endpointClass);

    return mergeEndpointInfoIntoOperationInfo(operationInfo, endpointInfo);
}

export {
    OperationInfo,
    getFullOperationInfo,
    getOperationInfo,
    setOperationInfo
};
