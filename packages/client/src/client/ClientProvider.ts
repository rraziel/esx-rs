import {ClassConstructor} from '@esx-rs/core';

/**
 * Client provider interface
 */
interface ClientProvider {

    /**
     * Create a proxy
     * @param resourceClass Resource class
     * @param <T>           Resource type
     * @return Proxy
     */
    createProxy<T>(resourceClass: ClassConstructor<T>): T;

}

export {
    ClientProvider
};
