# Client

ESX-RS can be used to create proxy instances where method calls are mapped to HTTP requests, and the HTTP responses are mapped to a value returned by the method call.

TODO: documentation
- `ClientFactory`
- `WebClient`

```typescript
let usersEndpoint: UsersEndpoint = ClientFactory.create('https://example.org/base/url', UsersEndpoint);
let user: User = await usersEndpoint.getUser('1234'); // GET https://example.org/base/url/users/1234
```
