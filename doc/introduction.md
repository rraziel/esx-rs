# Introduction

ESX-RS provides a set of decorators that can be used to describe a REST API:

- operations, or methods
- resources, or objects

## Resources

A resource is an object that is uniquely identified by an URL, also known as the resource path.

Typically, reading from a resource path will return the resource data as JSON.

### Resource Path

Definining a resource path is achieved through the `@Path` decorator:

```typescript
class MyEndpoint {
    @Path('/books')
    async getAllBooks(): Promise<Book[]> {
        return [];
    }
}
```

Here we have defined that the `/books` URL holds a list of books, as the method (or operation, cf.

### Endpoint Path

TODO.

## Operations

TODO

### Method

The HTTP method(s) supported by an operation can be specified using the `@HttpMethod` decorator:

```typescript
class MyEndpoint {
    @HttpMethod('POST') @HttpMethod('PUT') @Path('/resource')
    async myOperation(payload: string): string {
        return payload;
    }
}
```

This means a `POST` or a `GET` on the `/resource` path will be handled by the `myOperation` method.

While the `@HttpMethod` decorator allows arbibrary HTTP methods to be used, a number of convenience decorators already exist for the most common ones: `@DELETE`, `@GET`, `@HEAD`, `@OPTIONS`, `@PATCH`, `@POST`, `@PUT`.

A shorter - but equivalent - version of the previous example would read:

```typescript
class MyEndpoint {
    @POST @PUT @Path('/resource')
    async myOperation(payload: string): string {
        return payload;
    }
}
```
