import {HttpRequest} from './HttpRequest';
import {Cookie} from './Cookie';

// TOD: getHeader when there is no header, same for cookies and query params
describe('HTTP request', () => {

    describe('returns undefined if', () => {
        let httpRequest: HttpRequest = new HttpRequest('POST', '/test');

        describe('no cookies are present when', () => {

            it('getting all cookies', () => {
                // when
                let cookies: Array<Cookie> = httpRequest.getCookies();
                // then
                expect(cookies).toBeUndefined();
            });

            it('getting a cookie', () => {
                // when
                let cookie: Cookie = httpRequest.getCookie('test');
                // then
                expect(cookie).toBeUndefined();
            });

            it('getting a cookie value', () => {
                // when
                let cookieValue: string = httpRequest.getCookieValue('test');
                // then
                expect(cookieValue).toBeUndefined();
            });

        });

        describe('no query parameters are present when', () => {

            it('getting all query parameters', () => {
                // when
                let queryParameters: Map<string, string> = httpRequest.getQueryParameters();
                // then
                expect(queryParameters).toBeUndefined();
            });

            it('getting a query parameter', () => {
                // when
                let queryParameter: string = httpRequest.getQueryParameter('test');
                // then
                expect(queryParameter).toBeUndefined();
            });

        });

    });

});
