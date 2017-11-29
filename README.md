# TSX-RS

A library inspired by [JAX-RS](https://en.wikipedia.org/wiki/Java_API_for_RESTful_Web_Services), allowing the description of REST endpoints through simple [TypeScript](https://www.typescriptlang.org/) decorators.

It has currently been integrated with:

- [Koa](https://github.com/koajs/koa) via the [koa-tsxrs](https://github.com/rraziel/koa-tsxrs) middleware

## Getting Started

Install the library using `npm`:

```
npm install tsxrs --save
```

Then create a class for endpoint:

```typescript
@Path('/users')
class UsersEndpoint {

    @POST
    async createUser(user: User): Promise<User> {
        // ...
    }

    @PUT @Path('/:userId')
    async updateUser(@PathParam('userId') userId: string, user: User): Promise<User> {
        // ...
    }

    @GET @Path('/:userId')
    async getUser(@PathParam('userId') userId: string): Promise<User> {
        // ...
    }

    @DELETE @Path('/:userId')
    async deleteUser(@PathParam('userId') userId: string): Promise<void> {
        // ...
    }

}
```

## Usage

### Decorators

Various decorators are available, each targetting a subset of the typical REST properties for a services.

The HTTP method(s) can be specified with the following decorators:

- `@DELETE`
- `@GET`
- `@HEAD`
- `@OPTIONS`
- `@PATCH`
- `@POST`
- `@PUT`

The resource path can be specified using:

- `@Path`

The consumed - bound to the HTTP `content-type` header - and consumed - bound to the HTTP `accept` header - media types can be specified using:

- `@Consumed`
- `@Produced`

### Endpoint vs. Operation

Many decorators can be used on both a class and its methods.

In this scenario, the `OperationInfo` object returned for a method contains merged information that includes both the operation and the endpoint information.

The following decorators can be used on classes and methods:

- `@DELETE`, `@GET`, `@HEAD`, `@OPTIONS`, `@PATCH`, `@POST` and `@PUT`
- `@Consumes` and `@Produces`
- `@Path`

The `@Path` decorator is a bit of a special case: the operation path is appended to the endpoint path.
