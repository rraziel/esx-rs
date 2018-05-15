
/**
 * HTTP statuses
 */
class HttpStatuses {
    static OK: number = 200;
    static OK_CREATED: number = 201;
    static OK_ACCEPTED: number = 202;
    static OK_NOCONTENT: number = 204;
    static BAD_REQUEST: number = 400;
    static UNAUTHORIZED: number = 401;
    static FORBIDDEN: number = 403;
    static NOT_FOUND: number = 404;
    static METHOD_NOT_ALLOWED: number = 405;
    static NOT_ACCEPTABLE: number = 406;
    static CONFLICT: number = 409;
    static UNSUPPORTED_MEDIA_TYPE: number = 415;
    static PRECONDITION_REQUIRED: number = 428;
    static INTERNAL_SERVER_ERROR: number = 500;
    static NOT_IMPLEMENTED: number = 501;
}

export {
    HttpStatuses
};
