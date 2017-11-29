import {OperationParameterType} from './operation-parameter-type';

/**
 * Operation parameter information
 */
interface OperationParameterInfo {
    name: string;
    parameterType: OperationParameterType;
    type?: Function;
}

export {
    OperationParameterInfo
};
