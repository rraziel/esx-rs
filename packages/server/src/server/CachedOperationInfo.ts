import { OperationInfo } from '@esx-rs/core';
import * as pathToRegexp from 'path-to-regexp';

/**
 * Cached operation information
 */
class CachedOperationInfo {
    readonly resourcePathRegExp: RegExp;
    readonly resourcePathKeys: Array<pathToRegexp.Key>;
    readonly operationInfo: OperationInfo;
    readonly methodName: string;
    readonly endpoint: Object;

    /**
     * Class constructor
     * @param endpoint      Endpoint
     * @param methodName    Method name
     * @param operationInfo Operation information
     */
    constructor(endpoint: Object, methodName: string, operationInfo: OperationInfo) {
        this.resourcePathKeys = [];
        this.resourcePathRegExp = pathToRegexp(operationInfo.resourcePath!, this.resourcePathKeys);
        this.operationInfo = operationInfo;
        this.methodName = methodName;
        this.endpoint = endpoint;
    }

}

export {
    CachedOperationInfo
};
