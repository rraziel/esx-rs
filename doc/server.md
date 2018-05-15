# Introduction

When used to develop a server, ESX-RS can be used to:

- map incoming HTTP requests to method calls
- map the result of such method calls to an HTTP response
- map any raised exception to an HTTP response

TODO: documentation
- `HttpEndpointManager`

```typescript
httpEndpointManager.registerEndpoints(new Endpoint());
let httpResponse: HttpResponse = await httpEndpointManager.handleRequest(httpRequest);
```
