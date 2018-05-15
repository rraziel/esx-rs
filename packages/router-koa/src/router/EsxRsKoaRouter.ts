import {EndpointManager} from '@esx-rs/server';
import {HttpRequest, HttpResponse} from '@esx-rs/http';
import {EsxRsKoaUtils} from './EsxRsKoaUtils';
import {Context, Middleware} from 'koa';

/**
 * ESX-RS Koa router
 */
class EsxRsKoaRouter {
    private endpointManager: EndpointManager = new EndpointManager();

    /**
     * Register endpoints
     * @param endpoints Endpoints
     * @return this
     */
    registerEndpoints(...endpoints: Object[]): EsxRsKoaRouter {
        this.endpointManager.registerEndpoints(...endpoints);
        return this;
    }

    /**
     * Get a middleware holding routes to the registered endpoints
     * @return Middleware
     */
    routes(): Middleware {
        return (context, next) => this.handleRequest(context, next);
    }

    /**
     * Handle a request
     * @param context Context
     * @param next    Next middleware
     */
    private async handleRequest(context: Context, next: () => Promise<any>): Promise<void> {
        let httpRequest: HttpRequest = EsxRsKoaUtils.buildHttpRequest(context.request);
        let httpResponse: HttpResponse = await this.endpointManager.handleRequest(httpRequest);

        EsxRsKoaUtils.fillResponse(context.response, httpResponse);

        await next();
    }

}

export {
    EsxRsKoaRouter
};
