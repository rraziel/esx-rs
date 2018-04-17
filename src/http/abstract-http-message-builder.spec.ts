import {AbstractHttpMessageBuilder} from './abstract-http-message-builder';
import {HttpHeader} from './http-header';

class HttpMessageBuilder extends AbstractHttpMessageBuilder {
    getHeaders(): Array<HttpHeader> { return this.headers; }
    getPayload(): string { return this.payload; }
}

describe('Abstract HTTP message builder', () => {
    let builder: HttpMessageBuilder;

    beforeEach(() => {
        builder = new HttpMessageBuilder();
    });

    it('can add a header', () => {
        // given
        let httpHeader: HttpHeader = new HttpHeader('test', 'value');
        // when
        builder.withHeader(httpHeader);
        // then
        let httpHeaders: Array<HttpHeader> = builder.getHeaders();
        expect(httpHeaders).not.toBeUndefined();
        expect(httpHeaders).toEqual(expect.arrayContaining([httpHeader]));
    });

    it('can add headers', () => {
        // given
        let httpHeader1: HttpHeader = new HttpHeader('test1', 'value1');
        let httpHeader2: HttpHeader = new HttpHeader('test2', 'value2');
        // when
        builder.withHeaders(httpHeader1, httpHeader2);
        // then
        let httpHeaders: Array<HttpHeader> = builder.getHeaders();
        expect(httpHeaders).not.toBeUndefined();
        expect(httpHeaders).toEqual(expect.arrayContaining([httpHeader1, httpHeader2]));
    });

    it('can add headers in multiple steps', () => {
        // given
        let httpHeader1: HttpHeader = new HttpHeader('test1', 'value1');
        let httpHeader2: HttpHeader = new HttpHeader('test2', 'value2');
        // when
        builder
            .withHeader(httpHeader1)
            .withHeader(httpHeader2)
        ;
        // then
        let httpHeaders: Array<HttpHeader> = builder.getHeaders();
        expect(httpHeaders).not.toBeUndefined();
        expect(httpHeaders).toEqual(expect.arrayContaining([httpHeader1, httpHeader2]));
    });

    it('can set a payload', () => {
        // given
        let payload: string = 'test';
        // when
        builder.withPayload(payload);
        // then
        let payloadSet: string = builder.getPayload();
        expect(payloadSet).toBe(payload);
    });

});
