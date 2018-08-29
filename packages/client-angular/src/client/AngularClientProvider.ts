import { ClientProvider } from '@esx-rs/client';
import { ClassConstructor } from '@esx-rs/http';
import { HttpClient } from '@angular/common/http';

/**
 * Angular client provider
 */
class AngularClientProvider implements ClientProvider {
    private httpClient: HttpClient|undefined;

    /**
     * Set the HTTP client
     * @param httpClient HTTP client
     */
    setHttpClient(httpClient: HttpClient): void {
        this.httpClient = httpClient;
    }

    /**
     * Create a proxy
     * @param resourceClass Resource class
     * @param <T>           Resource type
     * @return Proxy
     */
    createProxy<T>(resourceClass: ClassConstructor<T>): T {
        return null as any as T; // TODO: implement
    }

}

export {
    AngularClientProvider
};
