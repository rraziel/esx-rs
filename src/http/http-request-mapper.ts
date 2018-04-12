import {HttpRequest} from './http-request';
import {HttpResponse} from './http-response';
import {OperationInfo, OperationParameterInfo, OperationParameterType} from '../metadata';

/**
 * HTTP request mapper
 */
class HttpRequestMapper {

    /**
     * Build a list of arguments based on an HTTP request
     * @param operationInfo Operation infortmation
     * @param httpRequest   HTTP request
     * @return Built argument list
     */
    async buildArguments(operationInfo: OperationInfo, httpRequest: HttpRequest): Promise<any[]> {
        let operationParameters: OperationParameterInfo[] = operationInfo.parameters;
        if (!operationParameters) {
            return [];
        }

        return operationParameters.map(operationParameterInfo => this.buildArgument(operationInfo, operationParameterInfo, httpRequest));
    }

    /**
     * Build an argument based on an HTTP request
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildArgument<T>(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): T {
        return null;
    }

}

export {
    HttpRequestMapper
};
