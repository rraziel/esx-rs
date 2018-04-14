
/**
 * HTTP header
 */
class HttpHeader {
    name: string;
    value?: string;

    /**
     * Class constructor
     * @param name  Header name
     * @param value Header value
     */
    constructor(name: string, value?: string) {
        this.name = name;
        this.value = value;
    }

}

export {
    HttpHeader
};
