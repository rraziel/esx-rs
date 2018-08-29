import { HttpContextResolver } from './HttpContextResolver';
import { ClassConstructor } from '../utils';

/**
 * HTTP context
 */
class HttpContext {
    private httpContextResolvers: Array<HttpContextResolver>;

    /**
     * Class constructor
     * @param httpContextResolvers HTTP context resolvers
     */
    constructor(...httpContextResolvers: HttpContextResolver[]) {
        this.httpContextResolvers = httpContextResolvers;
    }

    /**
     * Get a context item
     * @param itemClass Item class
     * @return Context item
     */
    get<T>(itemClass: ClassConstructor<T>): T|undefined {
        let item: T|undefined;

        this.httpContextResolvers.some(httpContextResolver => {
            item = httpContextResolver(itemClass);
            return item !== undefined;
        });

        return item;
    }

}

export {
    HttpContext
};
