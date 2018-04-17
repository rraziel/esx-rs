import {HttpRequestBuilder} from './http-request-builder';
import {HttpMethod} from './http-method';
import {HttpRequest} from './http-request';

describe('HTTP request builder', () => {
    let builder: HttpRequestBuilder;

    beforeEach(() => {
        builder = new HttpRequestBuilder();
    });

    it('can set a method', () => {
        // given
        let httpMethod: HttpMethod = HttpMethod.PATCH;
        // when
        let httpRequest: HttpRequest = builder.withMethod(httpMethod).build();
        // then
        expect(httpRequest.getMethod()).toEqual('PATCH');
    });

    it('can set a method as a string', () => {
        // given
        let httpMethod: string = 'CUSTOM';
        // when
        let httpRequest: HttpRequest = builder.withMethod(httpMethod).build();
        // then
        expect(httpRequest.getMethod()).toEqual('CUSTOM');
    });

});
