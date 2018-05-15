import {OperationInfo} from '@esx-rs/core';
import * as pathToRegexp from 'path-to-regexp';

/**
 * Cached operation information
 */
interface CachedOperationInfo {
    endpoint: Object;
    methodName: string;
    operationInfo: OperationInfo;
    resourcePathRegExp: RegExp;
    resourcePathKeys?: pathToRegexp.Key[];
}

/*
    if (operationInfo.resourcePath) {
        operationInfo.resourcePathKeys = [];
        operationInfo.resourcePathRegExp = pathToRegexp(operationInfo.resourcePath, operationInfo.resourcePathKeys);
    }
*/

export {
    CachedOperationInfo
};
