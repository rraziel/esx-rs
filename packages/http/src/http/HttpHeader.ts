
/**
 * HTTP header
 */
class HttpHeader {
    private name: string;
    private value?: string;

    /**
     * Class constructor
     * @param name  Header name
     * @param value Header value
     */
    constructor(name: string, value?: string) {
        this.name = name;
        this.value = value;
    }

    /**
     * Get the name
     * @return Header name
     */
    getName(): string {
        return this.name;
    }

    /**
     * Get the value
     * @return Header value
     */
    getValue(): string {
        return this.value;
    }

}

export {
    HttpHeader
};
