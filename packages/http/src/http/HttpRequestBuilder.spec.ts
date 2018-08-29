import { HttpRequestBuilder } from './HttpRequestBuilder';
import { Cookie } from './Cookie';
import { HttpRequest } from './HttpRequest';

describe('HTTP request builder', () => {
    let builder: HttpRequestBuilder;

    beforeEach(() => {
        builder = new HttpRequestBuilder();
    });

    it('can set a method', () => {
        // given
        let httpMethod: string = 'POST';
        // when
        let httpRequest: HttpRequest = builder.withMethod(httpMethod).build();
        // then
        expect(httpRequest.getMethod()).toBe('POST');
    });

    it('can set a path', () => {
        // given
        let path: string = '/test';
        // when
        let httpRequest: HttpRequest = builder.withPath(path).build();
        // then
        expect(httpRequest.getPath()).toBe('/test');
    });

    it('can set a query parameter', () => {
        // when
        let httpRequest: HttpRequest = builder
            .withQuery('test', 'value')
            .build()
        ;
        // then
        expect(httpRequest.getQueryParameter('test')).toBe('value');
    });

    it('can set multiple query parameters', () => {
        // when
        let httpRequest: HttpRequest = builder
            .withQuery('test1', 'value1')
            .withQuery('test2', 'value2')
            .build()
        ;
        // then
        let queryParameters: Map<string, string> = httpRequest.getQueryParameters();
        expect(queryParameters).not.toBeUndefined();
        expect(queryParameters.get('test1')).toBe('value1');
        expect(queryParameters.get('test2')).toBe('value2');
    });

    it('can add a cookie', () => {
        // given
        let cookie: Cookie = new Cookie('test', 'value');
        // when
        let httpRequest: HttpRequest = builder
            .withCookie(cookie)
            .build()
        ;
        // then
        expect(httpRequest.getCookieValue('test')).toBe('value');
    });

    it('can add multiple cookies', () => {
        // given
        let cookie1: Cookie = new Cookie('test1', 'value1');
        let cookie2: Cookie = new Cookie('test2', 'value2');
        // when
        let httpRequest: HttpRequest = builder
            .withCookies(cookie1, cookie2)
            .build()
        ;
        // then
        expect(httpRequest.getCookieValue('test1')).toBe('value1');
        expect(httpRequest.getCookieValue('test2')).toBe('value2');
    });

    it('can add cookies in multiple steps', () => {
        // given
        let cookie1: Cookie = new Cookie('test1', 'value1');
        let cookie2: Cookie = new Cookie('test2', 'value2');
        // when
        let httpRequest: HttpRequest = builder
            .withCookie(cookie1)
            .withCookie(cookie2)
            .build()
        ;
        // then
        expect(httpRequest.getCookieValue('test1')).toBe('value1');
        expect(httpRequest.getCookieValue('test2')).toBe('value2');
    });

});
