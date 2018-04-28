import {ClassConstructor} from 'es-decorator-utils';

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
    resolve<T>(itemClass: ClassConstructor<T>): T;

}

export {
    HttpContextResolver
};
