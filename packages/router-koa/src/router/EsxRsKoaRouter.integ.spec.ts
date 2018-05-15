import {Consumes, FormParam, GET, Path, PathParam, POST, Produces, PUT} from '@esx-rs/core';
import {EsxRsKoaRouter} from './EsxRsKoaRouter';
import * as Application from 'koa';
import * as http from 'http';
import * as fetch from 'node-fetch';
import * as bodyParser from 'koa-bodyparser';
import cookie from 'koa-cookie';

const CONTENTTYPE_FORM: string = 'application/x-www-form-urlencoded';

class TestResource {
    static MEDIA_TYPE: string = 'application/vnd.test.resource+json';
    value: string;
}

@Path('/integ')
class IntegrationTestEndpoint {

    @GET @Path('/tests/:testId')
    @Produces('text/plain')
    async getText(@PathParam('testId') id: number): Promise<string> {
        return 'get-text:' + id;
    }

    @GET @Path('/tests/:testId')
    @Produces(TestResource.MEDIA_TYPE)
    async getJson(@PathParam('testId') id: number): Promise<TestResource> {
        return {value: 'get-text:' + id};
    }

    @POST @Path('/tests/:testId')
    @Produces('text/plain') @Consumes('text/plain')
    async postText(@PathParam('testId') id: number, text: string): Promise<string> {
        return text + ':' + id;
    }

    @POST @Path('/tests/:testId')
    @Produces('text/plain') @Consumes(CONTENTTYPE_FORM)
    async postForm(@PathParam('testId') id: number, @FormParam('form-param-1') text: string, @FormParam('form-param-2') num: number): Promise<string> {
        return text + ':' + id + '=' + num;
    }

    @POST @Path('/tests/:testId')
    @Produces(TestResource.MEDIA_TYPE) @Consumes(TestResource.MEDIA_TYPE)
    async postJson(@PathParam('testId') id: number, obj: TestResource): Promise<TestResource> {
        return {value: obj.value + ':' + id};
    }

    @PUT @Path('/tests/:testId')
    @Produces('text/plain') @Consumes('text/plain')
    async putText(@PathParam('testId') id: number, text: string): Promise<string> {
        return text + ':' + id;
    }

    @PUT @Path('/tests/:testId')
    @Produces(TestResource.MEDIA_TYPE) @Consumes(TestResource.MEDIA_TYPE)
    async putJson(@PathParam('testId') id: number, obj: TestResource): Promise<TestResource> {
        return {value: obj.value + ':' + id};
    }

}

function executeRequest(server: http.Server, path: string, options?: fetch.RequestInit): Promise<fetch.Response> {
    let {address, port} = <fetch.AddressInfo> server.address();
    let url: string;

    address = (address === '::') ? 'localhost' : address;
    url = `http://${address}:${port}/integ${path}`;

    return fetch.default(url, options);
}

describe('ESX-RS Koa router (integration)', () => {
    let esxRsKoaRouter: EsxRsKoaRouter;
    let application: Application;
    let server: http.Server;

    beforeAll(() => {
        esxRsKoaRouter = new EsxRsKoaRouter();
        esxRsKoaRouter.registerEndpoints(new IntegrationTestEndpoint());
        application = new Application();
        server = application
            .use(cookie())
            .use(bodyParser({
                detectJSON: ctx => /[\/\+]json$/.test(ctx.request.headers['content-type'])
            }))
            .use(esxRsKoaRouter.routes())
            .listen()
        ;
    });

    describe('can route a GET request', () => {

        it('with plain text', async () => {
            // when
            let response: fetch.Response = await executeRequest(server, '/tests/1', {
                headers: {
                    'accept': 'text/plain'
                }
            });
            // then
            let responseText: string = await response.text();
            expect(response.headers.get('content-type')).toBe('text/plain');
            expect(response.status).toBe(200);
            expect(responseText).toBe('get-text:1');
        });

        it('with JSON', async () => {
            // when
            let response: fetch.Response = await executeRequest(server, '/tests/1', {
                headers: {
                    'accept': TestResource.MEDIA_TYPE
                }
            });
            // then
            let responseText: string = await response.text();
            expect(response.headers.get('content-type')).toBe(TestResource.MEDIA_TYPE);
            expect(response.status).toBe(200);
            expect(JSON.parse(responseText)).toEqual({value: 'get-text:1'});
        });

    });

    describe('can route a POST request', () => {

        it('with form parameters', async () => {
            // when
            let response: fetch.Response = await executeRequest(server, '/tests/1', {
                method: 'POST',
                headers: {
                    'accept': 'text/plain',
                    'content-type': CONTENTTYPE_FORM
                },
                body: 'form-param-1=value1&form-param-2=42'
            });
            // then
            let responseText: string = await response.text();
            expect(response.headers.get('content-type')).toBe('text/plain');
            expect(response.status).toBe(200);
            expect(responseText).toBe('value1:1=42');
        });

        it('with JSON', async () => {
            // when
            let response: fetch.Response = await executeRequest(server, '/tests/1', {
                method: 'POST',
                headers: {
                    'accept': TestResource.MEDIA_TYPE,
                    'content-type': TestResource.MEDIA_TYPE
                },
                body: '{"value":"put-text"}'
            });
            // then
            let responseText: string = await response.text();
            expect(response.headers.get('content-type')).toBe(TestResource.MEDIA_TYPE);
            expect(response.status).toBe(200);
            expect(JSON.parse(responseText)).toEqual({value:'put-text:1'});
        });

    });

    describe('can route a PUT request', () => {

        it.skip('with plain text', async () => {
            // when
            let response: fetch.Response = await executeRequest(server, '/tests/1', {
                method: 'PUT',
                headers: {
                    'accept': 'text/plain',
                    'content-type': 'text/plain'
                },
                body: 'put-text'
            });
            // then
            let responseText: string = await response.text();
            expect(response.headers.get('content-type')).toBe('text/plain');
            expect(response.status).toBe(200);
            expect(responseText).toBe('put-text:1');
        });

        it('with JSON', async () => {
            // when
            let response: fetch.Response = await executeRequest(server, '/tests/1', {
                method: 'PUT',
                headers: {
                    'accept': TestResource.MEDIA_TYPE,
                    'content-type': TestResource.MEDIA_TYPE
                },
                body: '{"value":"put-text"}'
            });
            // then
            let responseText: string = await response.text();
            expect(response.headers.get('content-type')).toBe(TestResource.MEDIA_TYPE);
            expect(response.status).toBe(200);
            expect(JSON.parse(responseText)).toEqual({value:'put-text:1'});
        });

    });

    afterAll(() => {
        server.close();
    });

});
