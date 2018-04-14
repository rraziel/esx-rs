
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
        if (index !== -1) {
            if (index === 0 || body.charAt(index - 1) === FORM_SEPARATOR) {
                let start: number = index + parameterName.length + 1;
                let end: number = body.indexOf(FORM_SEPARATOR, start);
                if (end === -1) {
                    return body.substr(start);
                } else {
                    return body.substring(start, end);
                }
            }
        }

        return undefined;
    }

}

export {
    HttpUtils
};
