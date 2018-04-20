# Decorators

Various decorators are available, each targetting a subset of the typical REST properties for a service.

## Method

The HTTP method(s) can be specified using:

- `@DELETE`
- `@GET`
- `@HEAD`
- `@OPTIONS`
- `@PATCH`
- `@POST`
- `@PUT`

## Path

The resource path can be specified using:

- `@Path`

Note: the [path-to-regexp](https://github.com/pillarjs/path-to-regexp) format is used, e.g. `/path/to/:resourceId/subpath/:subresourceId`.

## Resource Type

The type of resource, either consumed by the operation (mapped to `content-type`) or produced by the operation (mapped to `accept`), can be specified using:

- `@Consumes`
- `@Produces`

Multiple media types may be specified.

## Parameters

Operation parameters and resource properties are mapped using a specific decorator for each parameter type:

- `@CookieParam`
- `@FormParam`
- `@HeaderParam`
- `@MatrixParam`
- `@QueryParam`
- `@PathParam`

## Context

It is also possible to map the following context information to a parameter using the `@ContextParam` decorator:

- `HttpContext`
- `HttpRequest`
- `HttpResponse`

## Endpoint vs. Operation

Many decorators can be applied to both a class and its methods.

In this scenario, the `OperationInfo` object returned for a method contains merged information that includes both the operation and the endpoint information.

The following decorators can be applied to both classes and methods:

- `@DELETE`, `@GET`, `@HEAD`, `@OPTIONS`, `@PATCH`, `@POST` and `@PUT`
- `@Consumes` and `@Produces`
- `@Path`

The `@Path` decorator is handled a bit differently: the operation path is appended to the endpoint path.
