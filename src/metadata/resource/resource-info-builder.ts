
/**
 * Resource information builder
 */
class ResourceInfoBuilder {
    private propertyKey: string|symbol;
    private target: Object;

    /**
     * Class constructor
     * @param target      Target
     * @param propertyKey Property key
     */
    private constructor(target: Object, propertyKey?: string|symbol) {
        this.target = target;
        this.propertyKey = propertyKey;
    }

    /**
     * Get an operation information builder for the specified class
     * @param target      Class prototype
     * @param propertyKey Property key
     * @return Operation information builder
     */
    static of(target: Object, propertyKey?: string|symbol): ResourceInfoBuilder {
        return new ResourceInfoBuilder(target, propertyKey);
    }

}

export {
    ResourceInfoBuilder
};
