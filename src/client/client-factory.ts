import {ClassConstructor} from '../utils';

/**
 * Client factory
 */
class ClientFactory {

    /**
     * Create a client proxy
     * @param baseAddress   Base address
     * @param resourceClass Resource class
     * @param <T>           Resource type
     * @return Client proxy
     */
    static create<T>(baseAddress: string, resourceClass: ClassConstructor<T>): T {
        return null;
    }

}

export {
    ClientFactory
};
