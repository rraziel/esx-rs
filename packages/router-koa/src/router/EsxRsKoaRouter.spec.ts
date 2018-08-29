import { EsxRsKoaRouter } from './EsxRsKoaRouter';
import { Context, Middleware, Request, Response } from 'koa';

describe('ESX-RS Koa router', () => {
    let esxRsKoaRouter: EsxRsKoaRouter = new EsxRsKoaRouter();

    beforeEach(() => {
        esxRsKoaRouter = new EsxRsKoaRouter();
    });

    it('calls the next middleware', async () => {
        // given
        let middleware: Middleware = esxRsKoaRouter.routes();
        let called: boolean = false;
        let context: Context =  <Context> <any> {
            request: {},
            response: {}
        };
        // when
        await middleware(context, async () => {
            called = true;
        });
        // expect
        expect(called).toBe(true);
    });

});
