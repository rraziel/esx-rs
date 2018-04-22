import {EndpointManager} from './endpoint-manager';
import {Consumes, GET, Path, POST, Produces, PUT} from '../decorators';
import {HttpHeader, HttpHeaders, HttpRequest, HttpRequestBuilder, HttpResponse, HttpStatuses} from '../http';

class TestResource {
    static MEDIA_TYPE: string = 'application/vnd.test.resource+json';
    value: string;
}

describe('Endpoint manager', () => {
    let endpointManager: EndpointManager;

    beforeEach(() => {
        endpointManager = new EndpointManager();
    });

    describe('can invoke operations based on requests', () => {

        it('with no parameters', async () => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('GET', '/test').build();
            class TestClass {
                @GET @Path('/test')
                async operation(): Promise<string> { return 'test'; }
            }
            endpointManager.registerEndpoints(new TestClass());
            // when
            let httpResponse: HttpResponse = await endpointManager.handleRequest(httpRequest);
            // then
            expect(httpResponse).not.toBeUndefined();
            expect(httpResponse.getStatusCode()).toBe(HttpStatuses.OK);
            expect(httpResponse.getPayload()).toBe('test');
        });

        describe('with a body parameter', () => {

            it('for a string', async () => {
                // given
                let httpRequest: HttpRequest = HttpRequestBuilder.of('PUT', '/test')
                    .withPayload('test')
                    .build()
                ;
                class TestClass {
                    @PUT @Path('/test')
                    async operation(value: string): Promise<string> { return value; }
                }
                endpointManager.registerEndpoints(new TestClass());
                // when
                let httpResponse: HttpResponse = await endpointManager.handleRequest(httpRequest);
                // then
                expect(httpResponse).not.toBeUndefined();
                expect(httpResponse.getStatusCode()).toBe(HttpStatuses.OK);
                expect(httpResponse.getPayload()).toBe('test');
            });

            it('for an object', async () => {
                // given
                let httpRequest: HttpRequest = HttpRequestBuilder.of('PUT', '/test')
                    .withPayload(JSON.stringify({value:'test'}))
                    .withHeader(new HttpHeader(HttpHeaders.CONTENT_TYPE, TestResource.MEDIA_TYPE))
                    .build()
                ;
                class TestClass {
                    @PUT @Path('/test')
                    @Consumes(TestResource.MEDIA_TYPE)
                    async operation(obj: TestResource): Promise<string> { return obj.value; }
                }
                endpointManager.registerEndpoints(new TestClass());
                // when
                let httpResponse: HttpResponse = await endpointManager.handleRequest(httpRequest);
                // then
                expect(httpResponse).not.toBeUndefined();
                expect(httpResponse.getStatusCode()).toBe(HttpStatuses.OK);
                expect(httpResponse.getPayload()).toBe('test');
            });

        });
    });

    describe('returns correct HTTP responses when no matching operation is found', () => {

        it('404 when no operation is found', async () => {
            // given
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/').build();
            // when
            let httpResponse: HttpResponse = await endpointManager.handleRequest(httpRequest);
            // then
            expect(httpResponse).not.toBeUndefined();
            expect(httpResponse.getStatusCode()).toBe(HttpStatuses.NOT_FOUND);
        });

        it('405 when the method is not supported', async () => {
            // given
            class TestClass {
                @GET @Path('/')
                async operation(): Promise<string> { return 'test'; }
            }
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/').build();
            endpointManager.registerEndpoints(new TestClass());
            // when
            let httpResponse: HttpResponse = await endpointManager.handleRequest(httpRequest);
            // then
            expect(httpResponse).not.toBeUndefined();
            expect(httpResponse.getStatusCode()).toBe(HttpStatuses.METHOD_NOT_ALLOWED);
        });

        it('406 when the accepted media type is not supported', async () => {
            // given
            class TestClass {
                @GET @Path('/')
                @Produces('text/plain')
                async operation(): Promise<string> { return 'test'; }
            }
            let httpRequest: HttpRequest = HttpRequestBuilder.of('GET', '/')
                .withHeader(new HttpHeader(HttpHeaders.ACCEPT, 'application/json'))
                .build()
            ;
            endpointManager.registerEndpoints(new TestClass());
            // when
            let httpResponse: HttpResponse = await endpointManager.handleRequest(httpRequest);
            // then
            expect(httpResponse).not.toBeUndefined();
            expect(httpResponse.getStatusCode()).toBe(HttpStatuses.NOT_ACCEPTABLE);
        });

        it('415 when the content media typoe is not supported', async () => {
            // given
            class TestClass {
                @POST @Path('/')
                @Consumes('text/plain')
                async operation(value: string): Promise<void> { /* empty */ }
            }
            let httpRequest: HttpRequest = HttpRequestBuilder.of('POST', '/')
                .withHeader(new HttpHeader(HttpHeaders.CONTENT_TYPE, 'application/json'))
                .build()
            ;
            endpointManager.registerEndpoints(new TestClass());
            // when
            let httpResponse: HttpResponse = await endpointManager.handleRequest(httpRequest);
            // then
            expect(httpResponse).not.toBeUndefined();
            expect(httpResponse.getStatusCode()).toBe(HttpStatuses.UNSUPPORTED_MEDIA_TYPE);
        });

    });

});
