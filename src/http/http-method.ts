
/**
 * HTTP method
 */
enum HttpMethod {
    DELETE,
    GET,
    HEAD,
    OPTIONS,
    PATCH,
    POST,
    PUT
}

const HTTP_METHOD_STRINGS: Map<HttpMethod, string> = new Map<HttpMethod, string>();
const HTTP_METHOD_METHODS: Map<string, HttpMethod> = new Map<string, HttpMethod>();

HTTP_METHOD_STRINGS
    .set(HttpMethod.DELETE, 'DELETE')
    .set(HttpMethod.GET, 'GET')
    .set(HttpMethod.HEAD, 'HEAD')
    .set(HttpMethod.OPTIONS, 'OPTIONS')
    .set(HttpMethod.PATCH, 'PATCH')
    .set(HttpMethod.POST, 'POST')
    .set(HttpMethod.PUT, 'PUT')
    .forEach((value, key) => HTTP_METHOD_METHODS.set(value, key))
;

/**
 * Get a string from an HTTP method
 * @param httpMethod HTTP method
 * @return String representation
 */
function getHttpMethodFromString(httpMethod: string): HttpMethod {
    return HTTP_METHOD_METHODS.get(httpMethod);
}

/**
 * Get an HTTP method from a string
 * @param httpMethod HTTP method string
 * @return HTTP method
 */
function getStringFromHttpMethod(httpMethod: HttpMethod): string {
    return HTTP_METHOD_STRINGS.get(httpMethod);
}

export {
    getHttpMethodFromString,
    getStringFromHttpMethod,
    HttpMethod
};
