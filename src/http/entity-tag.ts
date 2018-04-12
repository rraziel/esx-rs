
/**
 * Entity tag
 */
class EntityTag {
    private value: string;
    private weak: boolean;

    /**
     * Class constructor
     * @param value Value
     * @param weak  Whether the tag is weak or strong
     */
    constructor(value: string, weak?: boolean) {
        this.value = value;
        this.weak = weak === undefined ? false : weak;
    }

    /**
     * Get the value
     * @return Value
     */
    getValue(): string {
        return this.value;
    }

    /**
     * Test whether the entity tag is weak
     * @return true if the entity tag is weak
     */
    isWeak(): boolean {
        return this.weak;
    }

    /**
     * Build an entity tag header string
     * @return Entity tag header string
     */
    toString(): string {
        return null;
    }

    /**
     * Create an entity tag by parsing the supplied string
     * @param value Entity tag value
     */
    static valueOf(value: string): EntityTag {
        return null;
    }

}

export {
    EntityTag
};
