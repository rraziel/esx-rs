import { ParameterType } from '../ParameterType';
import { ClassConstructor } from 'es-decorator-utils';

/**
 * Operation parameter information
 */
class OperationParameterInfo {
    readonly class: Function;
    readonly type: ParameterType;

    name?: string|ClassConstructor<any>;

    /**
     * Class constructor
     * @param parameterClass Parameter class
     * @param parameterType  Parameter type
     */
    constructor(parameterClass: Function, parameterType: ParameterType) {
        this.class = parameterClass;
        this.type = parameterType;
    }

}

export {
    OperationParameterInfo
};
