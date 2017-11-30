# TSX-RS

[![AppVeyor](https://img.shields.io/appveyor/ci/rraziel/tsxrs/master.svg?label=Win32&style=flat)](https://ci.appveyor.com/project/rraziel/tsxrs)
[![CircleCI](https://img.shields.io/circleci/project/github/rraziel/tsxrs/master.svg?label=MacOS&style=flat)](https://circleci.com/gh/rraziel/tsxrs)
[![Travis CI](https://img.shields.io/travis/rraziel/tsxrs/master.svg?label=Linux&style=flat)](https://travis-ci.org/rraziel/tsxrs)
[![AppVeyor tests](https://img.shields.io/appveyor/tests/rraziel/tsxrs/master.svg?label=Tests&style=flat)](https://ci.appveyor.com/project/rraziel/tsxrs/build/tests)
[![Codecov](https://img.shields.io/codecov/c/github/rraziel/tsxrs.svg?label=Coverage&style=flat)](https://codecov.io/gh/rraziel/tsxrs)
[![Code Climate](https://img.shields.io/codeclimate/maintainability/rraziel/tsxrs.svg?label=Maintainability&style=flat)](https://codeclimate.com/github/rraziel/tsxrs)
[![Code Climate](https://img.shields.io/codeclimate/issues/github/rraziel/tsxrs.svg?label=Code%20Issues&style=flat)](https://codeclimate.com/github/rraziel/tsxrs/issues)

[![Dependencies](https://img.shields.io/david/rraziel/tsxrs.svg?label=Dependencies&style=flat)](https://david-dm.org/rraziel/tsxrs)
[![Development dependencies](https://img.shields.io/david/dev/rraziel/tsxrs.svg?label=Dev%20Dependencies&style=flat)](https://david-dm.org/rraziel/tsxrs?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/rraziel/tsxrs/badge.svg)](https://snyk.io/test/github/rraziel/tsxrs)
[![Greenkeeper](https://badges.greenkeeper.io/rraziel/tsxrs.svg)](https://greenkeeper.io/)

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

- `@Consumes`
- `@Produces`

### Endpoint vs. Operation

Many decorators can be used on both a class and its methods.

In this scenario, the `OperationInfo` object returned for a method contains merged information that includes both the operation and the endpoint information.

The following decorators can be used on classes and methods:

- `@DELETE`, `@GET`, `@HEAD`, `@OPTIONS`, `@PATCH`, `@POST` and `@PUT`
- `@Consumes` and `@Produces`
- `@Path`

The `@Path` decorator is a bit of a special case: the operation path is appended to the endpoint path.
