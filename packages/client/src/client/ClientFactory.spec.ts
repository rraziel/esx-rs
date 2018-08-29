import { ClientFactory } from './ClientFactory';
import { ClientProvider } from './ClientProvider';
import { ClassConstructor } from '@esx-rs/core';

class TestResource {
    value: string;
}

class TestClientProvider implements ClientProvider {
    createProxy<T>(resourceClass: ClassConstructor<T>): T {
        return <T> <any> {value: 'test'};
    }
}

describe('Client factory', () => {
    let clientProvider: ClientProvider;

    beforeEach(() => {
        clientProvider = new TestClientProvider();
        ClientFactory.setClientProvider(clientProvider);
    });

    afterEach(() => {
        ClientFactory.setClientProvider(null);
    });

    it('uses the client provider to instantiate proxies', () => {
        // when
        let testResource: TestResource = ClientFactory.create(null, TestResource);
        // then
        expect(testResource).not.toBeUndefined();
        expect(testResource.value).toBe('test');
    });

});
