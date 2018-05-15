
/**
 * Cookie
 */
class Cookie {
    private name: string;
    private value: string;

    /**
     * Class constructor
     * @param name  Cookie name
     * @param value Cookie value
     */
    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

    /**
     * Get the cookie name
     * @return Cookie name
     */
    getName(): string {
        return this.name;
    }

    /**
     * Get the cookie value
     * @return Cookie value
     */
    getValue(): string {
        return this.value;
    }

}

export {
    Cookie
};
