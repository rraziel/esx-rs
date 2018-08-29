import { CachedOperationInfo } from './CachedOperationInfo';
import { HttpUtils } from '../utils';
import { ClassConstructor, OperationInfo, OperationParameterInfo, ParameterType } from '@esx-rs/core';
import { HttpHeaders, HttpRequest } from '@esx-rs/http';

const FORM_CONTENT_TYPE: string = 'application/x-www-form-urlencoded';

/**
 * Server request mapper
 */
class ServerRequestMapper {

    /**
     * Build a list of arguments based on an HTTP request
     * @param cachedOperationInfo Cached operation information
     * @param httpRequest         HTTP request
     * @return Built argument list
     */
    async buildArguments(cachedOperationInfo: CachedOperationInfo, httpRequest: HttpRequest): Promise<any[]> {
        let operationInfo: OperationInfo = cachedOperationInfo.operationInfo;
        let operationParameters: OperationParameterInfo[] = operationInfo.parameters;
        if (!operationParameters) {
            return [];
        }

        return operationParameters.map(operationParameterInfo => this.buildArgument(cachedOperationInfo, operationParameterInfo, httpRequest));
    }

    /**
     * Build an argument based on an HTTP request
     * @param cachedOperationInfo    Cached operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @param <T>                    Argument type
     * @return Built argument
     */
    private buildArgument<T>(cachedOperationInfo: CachedOperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): T|undefined {
        let operationInfo: OperationInfo = cachedOperationInfo.operationInfo;
        let parameterClass: Function = operationParameterInfo.class;
        let argumentValue: T|undefined;

        if (!this.isPrimitiveClass(parameterClass)) {
            argumentValue = this.buildComplexArgument<T>(cachedOperationInfo, operationParameterInfo, httpRequest);
        } else {
            let argumentString: string|undefined = this.buildPrimitiveArgument<T>(cachedOperationInfo, operationParameterInfo, httpRequest);
            if (argumentString) {
                argumentValue = this.convertPrimitiveArgument<T>(operationInfo, operationParameterInfo, argumentString);
            }
        }

        return argumentValue;
    }

    /**
     * Build a complex argument based on an HTTP request
     * @param cachedOperationInfo    Cached operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @param <T>                    Argument type
     * @return Built argument
     */
    private buildComplexArgument<T>(cachedOperationInfo: CachedOperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): T|undefined {
        let argumentValue: T|undefined;

        if (operationParameterInfo.type === ParameterType.CONTEXT) {
            argumentValue = this.buildContextArgument<T>(cachedOperationInfo, operationParameterInfo, httpRequest);
        } else if (operationParameterInfo.type === ParameterType.BODY) {
            let argumentString: string|undefined = this.buildBodyArgument(cachedOperationInfo, operationParameterInfo, httpRequest);
            if (argumentString) {
                argumentValue = JSON.parse(argumentString);
            }
        } else {
            throw new Error('complex non-payload parameters not implemented yet');
        }

        return argumentValue;
    }

    /**
     * Build a primitive argument based on an HTTP request
     * @param cachedOperationInfo    Cached operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument string
     */
    private buildPrimitiveArgument<T>(cachedOperationInfo: CachedOperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string|undefined {
        let operationInfo: OperationInfo = cachedOperationInfo.operationInfo;

        switch (operationParameterInfo.type) {
        case ParameterType.BODY:
            return this.buildBodyArgument(cachedOperationInfo, operationParameterInfo, httpRequest);
        case ParameterType.CONTEXT:
            return this.buildContextArgument<string>(cachedOperationInfo, operationParameterInfo, httpRequest);
        case ParameterType.COOKIE:
            return this.buildCookieArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.FORM:
            return this.buildFormArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.HEADER:
            return this.buildHeaderArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.MATRIX:
            return this.buildMatrixArgument(operationInfo, operationParameterInfo, httpRequest);
        case ParameterType.PATH:
            return this.buildPathArgument(cachedOperationInfo, operationParameterInfo, httpRequest);
        case ParameterType.QUERY:
            return this.buildQueryArgument(operationInfo, operationParameterInfo, httpRequest);
        default:
            throw new Error('unknown parameter type ' + operationParameterInfo.type);
        }
    }

    /**
     * Build an argument based on a request body
     * @param cachedOperationInfo    Cached operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildBodyArgument(cachedOperationInfo: CachedOperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string|undefined {
        return httpRequest.getPayload();
    }

    /**
     * Build an argument based on contextual information
     * @param cachedOperationInfo    Cached operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @param <T>                    Argument type
     * @return Built argument
     */
    private buildContextArgument<T>(cachedOperationInfo: CachedOperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): T {
        let contextClass: ClassConstructor<T> = operationParameterInfo.name as any as ClassConstructor<T>;

        // TODO: use context resolvers
        if (<Function> contextClass === HttpRequest) {
            return httpRequest as any as T;
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
    private buildCookieArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string|undefined {
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
    private buildFormArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string|undefined {
        let parameterName: string = <string> operationParameterInfo.name;
        let contentType: string|undefined = httpRequest.getHeaderValue(HttpHeaders.CONTENT_TYPE);

        if (contentType && contentType === FORM_CONTENT_TYPE && httpRequest.hasPayload()) {
            let payload: string = httpRequest.getPayload()!;
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
    private buildHeaderArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string|undefined {
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
    private buildMatrixArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string|undefined {
        let parameterName: string = <string> operationParameterInfo.name;
        return httpRequest.getMatrixParameter(parameterName);
    }

    /**
     * Build an argument based on an HTTP request path
     * @param cachedOperationInfo    Cached operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildPathArgument(cachedOperationInfo: CachedOperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string|undefined {
        let parameterName: string = <string> operationParameterInfo.name;
        let resourcePathRegExp: RegExp = cachedOperationInfo.resourcePathRegExp;
        let path: string = httpRequest.path;

        return HttpUtils.getPathParameterValue(path, resourcePathRegExp, cachedOperationInfo.resourcePathKeys, parameterName);
    }

    /**
     * Build an argument based on an HTTP request query parameter
     * @param operationInfo          Operation information
     * @param operationParameterInfo Operation parameter information
     * @param httpRequest            HTTP request
     * @return Built argument
     */
    private buildQueryArgument(operationInfo: OperationInfo, operationParameterInfo: OperationParameterInfo, httpRequest: HttpRequest): string|undefined {
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
            return argumentString as any as T;
        }

        if (argumentClass === Number) {
            return parseInt(argumentString, 10) as any as T;
        }

        if (argumentClass === Boolean) {
            return (argumentString.toLowerCase() === 'true') as any as T;
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
    ServerRequestMapper
};
