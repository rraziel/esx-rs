
/**
 * Cookie
 */
class Cookie {
    private name: string;
    private value: string;
    private path: string;
    private domain: string;
    private version: number;

    /**
     * Class constructor
     * @param name    Name
     * @param value   Value
     * @param path    Path
     * @param domain  Domain
     * @param version Version
     */
    constructor(name: string, value: string, path?: string, domain?: string, version?: number) {
        this.name = name;
        this.value = value;
        this.path = path;
        this.domain = domain;
        this.version = version;
    }

    static valueOf(value: string): Cookie {
        return null;
    }

}

export {
    Cookie
};
