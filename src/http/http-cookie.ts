
/**
 * HTTP cookie
 */
class HttpCookie {
    name: string;
    value: string;

    /**
     * Class constructor
     * @param name  Cookie name
     * @param value Cookie value
     */
    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

}

export {
    HttpCookie
};
