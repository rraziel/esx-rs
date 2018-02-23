# ESX-RS

[![AppVeyor](https://img.shields.io/appveyor/ci/rraziel/esx-rs/master.svg?label=Win32&style=flat)](https://ci.appveyor.com/project/rraziel/esx-rs)
[![CircleCI](https://img.shields.io/circleci/project/github/rraziel/esx-rs/master.svg?label=MacOS&style=flat)](https://circleci.com/gh/rraziel/esx-rs)
[![Travis CI](https://img.shields.io/travis/rraziel/esx-rs/master.svg?label=Linux&style=flat)](https://travis-ci.org/rraziel/esx-rs)
[![AppVeyor tests](https://img.shields.io/appveyor/tests/rraziel/esx-rs/master.svg?label=Tests&style=flat)](https://ci.appveyor.com/project/rraziel/esx-rs/build/tests)
[![Codecov](https://img.shields.io/codecov/c/github/rraziel/esx-rs.svg?label=Coverage&style=flat)](https://codecov.io/gh/rraziel/esx-rs)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/rraziel/esx-rs.svg?label=Maintainability&style=flat)](https://codeclimate.com/github/rraziel/esx-rs)
[![Code Climate](https://img.shields.io/codeclimate/issues/github/rraziel/esx-rs.svg?label=Code%20Issues&style=flat)](https://codeclimate.com/github/rraziel/esx-rs/issues)

[![Dependencies](https://img.shields.io/david/rraziel/esx-rs.svg?label=Dependencies&style=flat)](https://david-dm.org/rraziel/esx-rs)
[![Development dependencies](https://img.shields.io/david/dev/rraziel/esx-rs.svg?label=Dev%20Dependencies&style=flat)](https://david-dm.org/rraziel/esx-rs?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/rraziel/esx-rs/badge.svg)](https://snyk.io/test/github/rraziel/esx-rs)
[![Greenkeeper](https://badges.greenkeeper.io/rraziel/esx-rs.svg)](https://greenkeeper.io/)

A library inspired by [JAX-RS](https://en.wikipedia.org/wiki/Java_API_for_RESTful_Web_Services), allowing the description of REST endpoints through simple [TypeScript](https://www.typescriptlang.org/) decorators.

It has currently been integrated with:

| Integration                                                                             | Type       | Description                                                                         |
|:----------------------------------------------------------------------------------------|:-----------|:------------------------------------------------------------------------------------|
| [esx-rs-client-http](https://github.com/rraziel/esx-rs-client-http)                     | Client     | Proxy generator for [Node http](https://nodejs.org/api/http.html).                  |
| [esx-rs-client-xmlhttprequest](https://github.com/rraziel/esx-rs-client-xmlhttprequest) | Client     | Proxy generator for [XMLHttpRequest](https://en.wikipedia.org/wiki/XMLHttpRequest). |
| [esx-rs-server-express](https://github.com/rraziel/esx-rs-server-express)               | Server     | Middleware for [Express](https://expressjs.com/).                                   |
| [esx-rs-server-koa](https://github.com/rraziel/esx-rs-server-koa)                       | Server     | Middleware for [Koa](http://koajs.com/).                                            |
| [es-validation](https://github.com/rraziel/es-validation)                               | Validation | Validate request and response constraints using decorators.                         |

## Getting Started

Install the library using `npm`:

```
npm install esx-rs --save
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

The HTTP method(s) can be specified using:

- `@DELETE`
- `@GET`
- `@HEAD`
- `@OPTIONS`
- `@PATCH`
- `@POST`
- `@PUT`

The resource path can be specified using:

- `@Path`

The consumed - mapped to `content-type` - and produced - mapped to `accept` - media types can be specified using:

- `@Consumes`
- `@Produces`

### Endpoint vs. Operation

Many decorators can be applied to both a class and its methods.

In this scenario, the `OperationInfo` object returned for a method contains merged information that includes both the operation and the endpoint information.

The following decorators can be applied to both classes and methods:

- `@DELETE`, `@GET`, `@HEAD`, `@OPTIONS`, `@PATCH`, `@POST` and `@PUT`
- `@Consumes` and `@Produces`
- `@Path`

The `@Path` decorator is handled a bit differently: the operation path is appended to the endpoint path.
