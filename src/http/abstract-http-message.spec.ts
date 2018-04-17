import {AbstractHttpMessage} from './abstract-http-message';
import {HttpHeader} from './http-header';

class HttpMessage extends AbstractHttpMessage {
    constructor(headers?: Array<HttpHeader>, payload?: string) {
        super(headers, payload);
    }
}

describe('Abstract HTTP message', () => {

    describe('can manage headers', () => {

        it('can get all headers', () => {
            // given
            let httpHeader1: HttpHeader = new HttpHeader('a', 'value-a');
            let httpHeader2: HttpHeader = new HttpHeader('b', 'value-b');
            let httpMessage: HttpMessage = new HttpMessage([httpHeader1, httpHeader2]);
            // when
            let httpHeaders: Array<HttpHeader> = httpMessage.getHeaders();
            // then
            expect(httpHeaders).not.toBeUndefined();
            expect(httpHeaders).toEqual([httpHeader1, httpHeader2]);
        });

        it('can get a header', () => {
            // given
            let httpMessage: HttpMessage = new HttpMessage([new HttpHeader('test', 'value')]);
            // when
            let httpHeader: HttpHeader = httpMessage.getHeader('test');
            // then
            expect(httpHeader).not.toBeUndefined();
            expect(httpHeader.getName()).toBe('test');
            expect(httpHeader.getValue()).toBe('value');
        });

        it('can get a header value', () => {
            // given
            let httpMessage: HttpMessage = new HttpMessage([new HttpHeader('test', 'value')]);
            // when
            let headerValue: string = httpMessage.getHeaderValue('test');
            // then
            expect(headerValue).toBe('value');
        });

        describe('returns undefined if no headers are present when', () => {
            let httpMessage: HttpMessage = new HttpMessage();

            it('getting all headers', () => {
                // when
                let httpHeaders: Array<HttpHeader> = httpMessage.getHeaders();
                // then
                expect(httpHeaders).toBeUndefined();
            });

            it('getting a header', () => {
                // when
                let httpHeader: HttpHeader = httpMessage.getHeader('test');
                // then
                expect(httpHeader).toBeUndefined();
            });

            it('getting a header value', () => {
                // when
                let headerValue: string = httpMessage.getHeaderValue('test');
                // then
                expect(headerValue).toBeUndefined();
            });

        });

    });

});
