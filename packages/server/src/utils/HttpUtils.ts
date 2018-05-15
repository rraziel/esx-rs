import * as pathToRegexp from 'path-to-regexp';

const FORM_SEPARATOR: string = '&';
const FORM_VALUE: string = '=';

/**
 * HTTP utility functions
 */
class HttpUtils {

    /**
     * Get a form parameter value
     * @param body          Body content
     * @param parameterName Parameter name
     * @return Form parameter value
     */
    static getFormParameterValue(body: string, parameterName: string): string {
        let index: number = body.indexOf(parameterName + FORM_VALUE);
        if (HttpUtils.isFormParameterFound(body, index)) {
            let begin: number = index + parameterName.length + 1;
            let end: number = body.indexOf(FORM_SEPARATOR, begin);
            return HttpUtils.extractParameterValue(body, begin, end);
        }

        return undefined;
    }

    /**
     * Get a path parameter value
     * @param path                  Path
     * @param pathSpecification     Path specification
     * @param pathSpecificationKeys Path specification keys
     * @param parameterName         Parameter name
     * @return Path parameter value
     */
    static getPathParameterValue(path: string, pathSpecification: RegExp, pathSpecificationKeys: pathToRegexp.Key[], parameterName: string): string {
        let pathMatches: string[] = pathSpecification.exec(path);
        if (pathMatches === null) {
            return undefined;
        }

        return HttpUtils.extractPathParameter(pathMatches, pathSpecificationKeys, parameterName);
    }

    /**
     * Extract a path parameter
     * @param pathMatches           Path matches
     * @param pathSpecificationKeys Path specification keys
     * @param parameterName         Parameter name
     * @return Path parameter value
     */
    private static extractPathParameter(pathMatches: string[], pathSpecificationKeys: pathToRegexp.Key[], parameterName: string): string {
        for (let i: number = 0; i !== pathSpecificationKeys.length; ++i) {
            let pathSpecificationKey: pathToRegexp.Key = pathSpecificationKeys[i];
            if (pathSpecificationKey.name === parameterName) {
                return decodeURIComponent(pathMatches[i + 1]);
            }
        }

        return undefined;
    }

    /**
     * Test whether a valid form parameter start index was found
     * @param body  Body
     * @param index Index
     * @return true if a valid index was found
     */
    private static isFormParameterFound(body: string, index: number): boolean {
        return index !== -1 && (index === 0 || body.charAt(index - 1) === FORM_SEPARATOR);
    }

    /**
     * Extract a parameter value
     * @param str   String
     * @param begin Begin index
     * @param end   End index
     */
    private static extractParameterValue(str: string, begin: number, end: number): string {
        if (end === -1) {
            end = undefined;
        }

        return str.substring(begin, end);
    }

}

export {
    HttpUtils
};
