
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
            return HttpUtils.extractFormParameterValue(body, begin, end);
        }

        return undefined;
    }

    /**
     * Test whether a valid index was found
     * @param body  Body
     * @param index Index
     * @return true if a valid index was found
     */
    private static isFormParameterFound(body: string, index: number): boolean {
        return index !== -1 && (index === 0 || body.charAt(index - 1) === FORM_SEPARATOR);
    }

    /**
     * Extract a form parameter value
     * @param body  Body
     * @param begin Begin index
     * @param end   End index
     */
    private static extractFormParameterValue(body: string, begin: number, end: number): string {
        if (end === -1) {
            return body.substr(begin);
        } else {
            return body.substring(begin, end);
        }
    }

}

export {
    HttpUtils
};
