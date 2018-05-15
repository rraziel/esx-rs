# Router for Koa

## Usage

### Router

Allowing Koa to use ESX-RS endpoints is done via a router middleware.

```typescript
import {EsxRsKoaRouter} from 'esx-rs-koa-router';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

let router: EsxRsKoaRouter = new EsxRsKoaRouter();
let app: Koa.Application = new Koa();

router.registerEndpoints(endpointA, endpointB, endpointC);
app
    .use(bodyParser())
    .use(router.routes())
;
```

Endpoints are registered via `registerEndpoints()` while the Koa middleware is obtained via `routes()`.

### Cookies

Support for cookies - i.e. `@CookieParam` - requires a cookie parser middleware, such as [koa-cookie](https://github.com/varunpal/koa-cookie).

```typescript
import cookie from 'koa-cookie';

app
    .use(cookie())
    .use(bodyParser())
    .use(router.routes())
;
```

In practice, anything placed in `context.cookie` will be treated as a set of cookies.

### Context Parameters

Additional ESX-RS context parameters are available for the `@ContextParam` decorator:

- `KoaContext`: the Koa `Context` object
- `KoaRequest`: the Koa `Request` object
- `KoaResponse`: the Koa `Response` object
