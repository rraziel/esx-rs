import { ClassConstructor } from '../utils';

/**
 * HTTP context resolver
 */
interface HttpContextResolver {

    /**
     * Resolve an HTTP context item
     * @param itemClass Item class
     * @param <T>       Item type
     * @return Item
     */
    <T>(itemClass: ClassConstructor<T>): T;

}

export {
    HttpContextResolver
};
