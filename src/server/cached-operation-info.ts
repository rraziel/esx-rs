import {OperationInfo} from '../metadata';

/**
 * Cached operation information
 */
interface CachedOperationInfo {
    endpoint: Object;
    methodName: string;
    operationInfo: OperationInfo;
}

export {
    CachedOperationInfo
};
