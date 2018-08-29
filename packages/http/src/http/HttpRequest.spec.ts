import { HttpRequest } from './HttpRequest';
import { Cookie } from './Cookie';

describe('HTTP request', () => {

    describe('returns an empty list/map when', () => {
        let httpRequest: HttpRequest;

        beforeEach(() => {
            httpRequest = new HttpRequest('POST', '/test', new Map<string, string>(), new Map<string, string>(), [], []);
        });

        it('getting all query parameters', () => {
            // when
            let queryParameters: Map<string, string> = httpRequest.getQueryParameters();
            // then
            expect(queryParameters.size).toBe(0);
        });

        it('returns an empty list when no cookies are present', () => {
            // given
            // when
            let cookies: Array<Cookie> = httpRequest.getCookies();
            // then
            expect(cookies.length).toBe(0);
        });

    });

    describe('returns undefined when', () => {
        let httpRequest: HttpRequest = new HttpRequest('POST', '/test', new Map<string, string>(), new Map<string, string>(), [], []);

        it('getting a query parameter that is not present', () => {
            // when
            let queryParameter: string|undefined = httpRequest.getQueryParameter('test');
            // then
            expect(queryParameter).toBeUndefined();
        });

        it('getting a cookie that is not present', () => {
            // when
            let cookie: Cookie|undefined = httpRequest.getCookie('test');
            // then
            expect(cookie).toBeUndefined();
        });

        it('getting a cookie value that is not present', () => {
            // when
            let cookieValue: string|undefined = httpRequest.getCookieValue('test');
            // then
            expect(cookieValue).toBeUndefined();
        });

    });

});
