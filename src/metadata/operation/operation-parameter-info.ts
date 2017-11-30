import {OperationParameterType} from './operation-parameter-type';

/**
 * Operation parameter information
 */
interface OperationParameterInfo {
    name: string;
    class: Function;
    type: OperationParameterType;
}

export {
    OperationParameterInfo
};
