# ESX-RS

[![AppVeyor](https://img.shields.io/appveyor/ci/rraziel/esx-rs/master.svg?label=Win32&style=for-the-badge&logo=appveyor)](https://ci.appveyor.com/project/rraziel/esx-rs)
[![CircleCI](https://img.shields.io/circleci/project/github/rraziel/esx-rs/master.svg?label=MacOS&style=for-the-badge&logo=circleci)](https://circleci.com/gh/rraziel/esx-rs)
[![Travis CI](https://img.shields.io/travis/rraziel/esx-rs/master.svg?label=Linux&style=for-the-badge&logo=travis)](https://travis-ci.org/rraziel/esx-rs)
[![Version](https://img.shields.io/npm/v/@esx-rs/core.svg?maxAge=2592000&label=Version&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@esx-rs/core)
[![Downloads](https://img.shields.io/npm/dt/@esx-rs/core.svg?maxAge=2592000&label=Downloads&style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@esx-rs/core)

A library inspired by [JAX-RS](https://en.wikipedia.org/wiki/Java_API_for_RESTful_Web_Services), allowing the description of REST endpoints through simple [TypeScript](https://www.typescriptlang.org/) decorators.

## Getting Started

The library can be installed using `npm`:

```
npm install esx-rs --save
```

Or using `yarn`:

```
yarn add esx-rs
```

Endpoints can then be described using decorators:

```typescript
@Path('/users')
@Produces('application/json') @Consumes('application/json')
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

Various decorators are available, each targetting a subset of the typical REST properties for a service.

### Path

The resource path can be specified using:

- `@Path`

Note: the [path-to-regexp](https://github.com/pillarjs/path-to-regexp) format is used, e.g. `/path/to/:resourceId/subpath/:subresourceId`.

### Resource Type

The type of resource, either consumed by the operation (mapped to `content-type`) or produced by the operation (mapped to `accept`), can be specified using:

- `@Consumes`
- `@Produces`

Multiple media types may be specified.

### Parameters

Operation parameters and resource properties are mapped using a specific decorator for each parameter type:

- `@CookieParam`
- `@FormParam`
- `@HeaderParam`
- `@MatrixParam`
- `@QueryParam`
- `@PathParam`

### Context

It is also possible to map the following context information to a parameter using the `@ContextParam` decorator:

- `HttpContext`
- `HttpRequest`
- `HttpResponse`

### Endpoint vs. Operation

Many decorators can be applied to both a class and its methods.

In this scenario, the `OperationInfo` object returned for a method contains merged information that includes both the operation and the endpoint information.

The following decorators can be applied to both classes and methods:

- `@DELETE`, `@GET`, `@HEAD`, `@OPTIONS`, `@PATCH`, `@POST` and `@PUT`
- `@Consumes` and `@Produces`
- `@Path`

The `@Path` decorator is handled a bit differently: the operation path is appended to the endpoint path.

## Known Limitations

At the moment, only concrete classes can be decorated.

This is due to the way ECMAScript gets generated, as interfaces no longer exist in the generated code.

To achieve a close equivalent, abstract classes can be used, so that the following interface:

```typescript
@Path('/example')
interface MyInterface {
    @GET @Path('/resource')
    myMethod(): Promise<string>;
}
```

Becomes:

```typescript
@Path('/example')
abstract class MyInterface {
    @GET @Path('/resource')
    abstract myMethod(): Promise<string>;
}
```

## Development

[![AppVeyor tests](https://img.shields.io/appveyor/tests/rraziel/esx-rs/master.svg?label=Tests&style=for-the-badge)](https://ci.appveyor.com/project/rraziel/esx-rs/build/tests)
[![Codecov](https://img.shields.io/codecov/c/github/rraziel/esx-rs.svg?label=Coverage&style=for-the-badge)](https://codecov.io/gh/rraziel/esx-rs)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/rraziel/esx-rs.svg?label=Maintainability&style=for-the-badge)](https://codeclimate.com/github/rraziel/esx-rs)
[![Code Climate](https://img.shields.io/codeclimate/issues/rraziel/esx-rs.svg?label=Code%20Issues&style=for-the-badge)](https://codeclimate.com/github/rraziel/esx-rs/issues)
