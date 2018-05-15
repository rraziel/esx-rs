import {ClientProvider} from './ClientProvider';
import {ClassConstructor} from '@esx-rs/core';

/**
 * Client factory
 */
class ClientFactory {
    private static clientProvider: ClientProvider;

    /**
     * Set the client provider
     * @param clientProvider Client provider
     */
    static setClientProvider(clientProvider: ClientProvider): void {
        ClientFactory.clientProvider = clientProvider;
    }

    /**
     * Create a client proxy
     * @param baseAddress   Base address
     * @param resourceClass Resource class
     * @param <T>           Resource type
     * @return Client proxy
     */
    static create<T>(baseAddress: string, resourceClass: ClassConstructor<T>): T {
        return ClientFactory.clientProvider.createProxy(resourceClass);
    }

}

export {
    ClientFactory
};
