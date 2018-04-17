import {HttpHeader} from './http-header';
import {HttpRequest} from './http-request';
import {HttpResponse} from './http-response';
import {HttpUtils} from './http-utils';
import {OperationInfo, OperationParameterInfo, ParameterType} from '../metadata';
import {ClassConstructor} from '../utils';

const HEADER_CONTENT_TYPE: string = 'content-type';
const FORM_CONTENT_TYPE: string = 'application/x-www-form-urlencoded';

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
     * @param <T>                    Argument type
     * @return Built argument
     */
    private buildArgument<T>(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): T {
        let parameterClass: Function = operationParameterInfo.class;
        let argumentValue: T;

        if (!this.isPrimitiveClass(parameterClass)) {
            if (operationParameterInfo.type === ParameterType.CONTEXT) {
                argumentValue = this.buildContextArgument<T>(operationInfo, operationParameterInfo, httpRequest);
            } else {
                throw new Error('complex parameters not implemented yet');
            }
        } else {
            let argumentString: string = this.buildPrimitiveArgument<T>(operationInfo, operationParameterInfo, httpRequest);
            argumentValue = this.convertPrimitiveArgument<T>(operationInfo, operationParameterInfo, argumentString);
        }

        return argumentValue;
    }

    /**
     * Build a primitive argument based on an HTTP request
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument string
     */
    private buildPrimitiveArgument<T>(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string {
        switch (operationParameterInfo.type) {
        case ParameterType.COOKIE:
            return this.buildCookieArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.FORM:
            return this.buildFormArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.HEADER:
            return this.buildHeaderArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.MATRIX:
            return this.buildMatrixArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.PATH:
            return this.buildPathArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.QUERY:
            return this.buildQueryArgument(operationInfo, operationParameterInfo, httpRequest);
        default:
            throw new Error('unknown parameter type ' + operationParameterInfo.type);
        }
    }

    /**
     * Build an argument based on contextual information
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @param <T>                    Argument type
     * @return Built argument
     */
    private buildContextArgument<T>(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): T {
        let contextClass: ClassConstructor<T> = <ClassConstructor<T>><any> operationParameterInfo.name;

        if (<Function> contextClass === HttpRequest) {
            return <T><any> httpRequest;
        }

        throw new Error('unknown context class ' + contextClass.name);
    }

    /**
     * Build an argument based on an HTTP request cookie
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildCookieArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string {
        let cookieName: string = <string> operationParameterInfo.name;
        return httpRequest.getCookieValue(cookieName);
    }

    /**
     * Build an argument based on an HTTP request form parameter
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildFormArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string {
        let parameterName: string = <string> operationParameterInfo.name;
        let contentType: string = httpRequest.getHeaderValue(HEADER_CONTENT_TYPE);

        if (contentType === FORM_CONTENT_TYPE && httpRequest.hasPayload()) {
            let payload: string = httpRequest.getPayload();
            return HttpUtils.getFormParameterValue(payload, parameterName);
        }

        return undefined;
    }

    /**
     * Build an argument based on an HTTP request header
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildHeaderArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string {
        let headerName: string = <string> operationParameterInfo.name;
        return httpRequest.getHeaderValue(headerName);
    }

    /**
     * Build an argument based on an HTTP request matrix parameter
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildMatrixArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string {
        let parameterName: string = <string> operationParameterInfo.name;
        // TODO
        return undefined;
    }

    /**
     * Build an argument based on an HTTP request path
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildPathArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string {
        let parameterName: string = <string> operationParameterInfo.name;
        let resourcePathRegExp: RegExp = operationInfo.resourcePathRegExp;
        let path: string = httpRequest.path;

        return HttpUtils.getPathParameterValue(path, resourcePathRegExp, operationInfo.resourcePathKeys, parameterName);
    }

    /**
     * Build an argument based on an HTTP request query parameter
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildQueryArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string {
        let parameterName: string = <string> operationParameterInfo.name;
        return httpRequest.getQueryParameter(parameterName);
    }

    /**
     * Convert a primitive argument to a specific type
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param argumentString         Argument value as a string
     * @param <T>                    Argument type
     * @return Built argument
     */
    private convertPrimitiveArgument<T>(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, argumentString: string): T {
        let argumentClass: Function = operationParameterInfo.class;

        if (argumentClass === String) {
            return <T><any> argumentString;
        }

        if (argumentClass === Number) {
            return <T><any> parseInt(argumentString, 10);
        }

        if (argumentClass === Boolean) {
            return <T><any> (argumentString.toLowerCase() === 'true');
        }

        throw new Error('unknown primitive argument class ' + argumentClass.name);
    }

    /**
     * Test whether a parameter class represents a primitive: string, number or boolean
     * @param parameterClass Parameter class
     * @return true if the class represents a primitive
     */
    private isPrimitiveClass(parameterClass: Function): boolean {
        return parameterClass === String || parameterClass === Number || parameterClass === Boolean;
    }

}

export {
    HttpRequestMapper
};
