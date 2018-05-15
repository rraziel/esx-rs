# Client

TODO: documentation
- `ClientFactory`
- `WebClient`

```typescript
let usersEndpoint: UsersEndpoint = ClientFactory.create('https://example.org/base/url', UsersEndpoint);
let user: User = await usersEndpoint.getUser('1234'); // GET https://example.org/base/url/users/1234
```
