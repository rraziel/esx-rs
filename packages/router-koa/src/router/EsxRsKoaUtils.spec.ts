import { EsxRsKoaUtils } from './EsxRsKoaUtils';
import { HttpHeader, HttpResponse } from '@esx-rs/http';
import { Response } from 'koa';

describe('ESX-RS with Koa utility functions', () => {

    it('can fill a Koa response based on an ESX-RS HTTP response', () => {
        // given
        let httpHeaders: Array<HttpHeader> = [
            new HttpHeader('content-type', 'test-content-type'),
            new HttpHeader('test-header', 'test-header-value')
        ];
        let httpResponse: HttpResponse = new HttpResponse(200, httpHeaders, 'test-payload');
        let response: Response = <Response> <any> {
            status: 404,
            message: 'Not Found',
            set: () => { /* empty */ }
        };
        // when
        EsxRsKoaUtils.fillResponse(response, httpResponse);
        // then
        // expect(response.headers).toEqual(expect.arrayContaining([??])); TODO: requires a fix in ESX-RS
        expect(response.status).toBe(200);
        expect(response.body).toBe('test-payload');
    });

});
