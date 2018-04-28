# ESX-RS

[![AppVeyor](https://img.shields.io/appveyor/ci/rraziel/esx-rs/master.svg?label=Win32&style=flat)](https://ci.appveyor.com/project/rraziel/esx-rs)
[![CircleCI](https://img.shields.io/circleci/project/github/rraziel/esx-rs/master.svg?label=MacOS&style=flat)](https://circleci.com/gh/rraziel/esx-rs)
[![Travis CI](https://img.shields.io/travis/rraziel/esx-rs/master.svg?label=Linux&style=flat)](https://travis-ci.org/rraziel/esx-rs)
[![AppVeyor tests](https://img.shields.io/appveyor/tests/rraziel/esx-rs/master.svg?label=Tests&style=flat)](https://ci.appveyor.com/project/rraziel/esx-rs/build/tests)
[![Codecov](https://img.shields.io/codecov/c/github/rraziel/esx-rs.svg?label=Coverage&style=flat)](https://codecov.io/gh/rraziel/esx-rs)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/rraziel/esx-rs.svg?label=Maintainability&style=flat)](https://codeclimate.com/github/rraziel/esx-rs)
[![Code Climate](https://img.shields.io/codeclimate/issues/rraziel/esx-rs.svg?label=Code%20Issues&style=flat)](https://codeclimate.com/github/rraziel/esx-rs/issues)

[![Dependencies](https://img.shields.io/david/rraziel/esx-rs.svg?label=Dependencies&style=flat)](https://david-dm.org/rraziel/esx-rs)
[![Development dependencies](https://img.shields.io/david/dev/rraziel/esx-rs.svg?label=Dev%20Dependencies&style=flat)](https://david-dm.org/rraziel/esx-rs?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/rraziel/esx-rs/badge.svg)](https://snyk.io/test/github/rraziel/esx-rs)
[![Greenkeeper](https://badges.greenkeeper.io/rraziel/esx-rs.svg)](https://greenkeeper.io/)

A library inspired by [JAX-RS](https://en.wikipedia.org/wiki/Java_API_for_RESTful_Web_Services), allowing the description of REST endpoints through simple [TypeScript](https://www.typescriptlang.org/) decorators.

It has currently been integrated with:

| Integration                                                               | Type       | Description                                                                                                |
|:--------------------------------------------------------------------------|:-----------|:-----------------------------------------------------------------------------------------------------------|
| [esx-rs-client](https://github.com/rraziel/esx-rs-client)                 | Client     | Proxy generator to access remote ESX-RS endpoints through a class instance.                                |
| [esx-rs-client-fetch](https://github.com/rraziel/esx-rs-client-fetch)     | Client     | `esx-rs-client` network transport based on [Fetch](https://fetch.spec.whatwg.org/).                        |
| [esx-rs-client-http](https://github.com/rraziel/esx-rs-client-http)       | Client     | `esx-rs-client` network transport based on [Node http](https://nodejs.org/api/http.html).                  |
| [esx-rs-client-xhr](https://github.com/rraziel/esx-rs-client-xhr)         | Client     | `esx-rs-client` network transport based on [XMLHttpRequest](https://en.wikipedia.org/wiki/XMLHttpRequest). |
| [esx-rs-server](https://github.com/rraziel/esx-rs-server)                 | Server     | Request dispatcher to process incoming HTTP requests through ESX-RS decorated class instances.             |
| [esx-rs-router-express](https://github.com/rraziel/esx-rs-router-express) | Server     | `esx-rs-server`-based router middleware for [Express](https://expressjs.com/).                             |
| [esx-rs-router-koa](https://github.com/rraziel/esx-rs-router-koa)         | Server     | `esx-rs-server`-based router middleware for [Koa](http://koajs.com/).                                      |
| [esx-rs-validation](https://github.com/rraziel/esx-rs-validation)         | Validation | Validation layer based on [es-validation](https://github.com/rraziel/es-validation).                       |
| [esx-rs-schema-openapi](https://github.com/rraziel/esx-rs-schema-openapi) | Schema     | Schema generation for [OpenAPI 3.0](https://www.openapis.org/).                                            |

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
@Produces('application/json')
@Consumes('application/json')
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

### Method

The HTTP method(s) can be specified using:

- `@DELETE`
- `@GET`
- `@HEAD`
- `@OPTIONS`
- `@PATCH`
- `@POST`
- `@PUT`

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

## Limitations

At the moment, only concrete classes can be decorated.

This is due to the way ECMAScript gets generated, as interfaces no longer exist in the generated code.
