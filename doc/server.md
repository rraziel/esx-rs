# Server

ESX-RS can be used server-side to map incoming HTTP request to method calls, then to map the result of such method calls to an HTTP response.

TODO: documentation
- `HttpEndpointManager`

```typescript
httpEndpointManager.registerEndpoints(new Endpoint());
let httpResponse: HttpResponse = await httpEndpointManager.handleRequest(httpRequest);
```
