import {ParameterType} from '../parameter-type';
import {ClassConstructor} from '../../utils';

/**
 * Operation parameter information
 */
interface OperationParameterInfo {
    name?: string|ClassConstructor<any>;
    class: Function;
    type: ParameterType;
}

export {
    OperationParameterInfo
};
