# TSX-RS

A library inspired by [JAX-RS](https://en.wikipedia.org/wiki/Java_API_for_RESTful_Web_Services), allowing the description of REST endpoints through simple [TypeScript](https://www.typescriptlang.org/) decorators.

It has currently been integrated with:

- [Koa](https://github.com/koajs/koa) via the [koa-tsxrs](https://github.com/rraziel/koa-tsxrs) middleware

## Getting Started

Install the library using `npm`:

```
npm install tsxrs --save
```

Then create an interface that describes the endpoint:

```typescript
@Path('/users')
interface UsersEndpoint {

    @POST
    @Consumes('application/vnd.example.user+json')
    @Produces('application/vnd.example.user+json')
    createUser(user: User): Promise<User>;

    @PUT @Path('/:userId')
    @Consumes('application/vnd.example.user+json')
    @Produces('application/vnd.example.user+json')
    updateUser(@PathParam('userId') userId: string, user: User): Promise<User>;

    @GET @Path('/:userId')
    @Produces('application/vnd.example.user+json')
    getUser(@PathParam('userId') userId: string): Promise<User>;

    @DELETE @Path('/:userId')
    deleteUser(@PathParam('userId') userId: string): Promise<void>;

}
```

Note: using a class would work just as well, however separating the interface (API) from the implementation is considered good practice.
