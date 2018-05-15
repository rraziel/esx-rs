# Content Negotiation

ESX-RS supports some level of [HTTP content negotiation](https://en.wikipedia.org/wiki/Content_negotiation) through the use of media ranges in the `Accept` HTTP header.

In practice, this means selecting the best endpoint method based on its `@Consumes` and `@Produces` headers, and serializing to the proper format when doing so.

## Basic Usage

Given the following endpoint:

```typescript
@Path('/articles')
class MyArticles {

    @GET @Path('/:articleId')
    @Produces('application/json')
    async getArticleInJson(@PathParam('articleId') articleId: string): Promise<Article> {
        return new Article();
    }

    @GET @Path('/:articleId')
    @Produces('application/xml')
    async getArticleInXml(@PathParam('articleId') articleId: string): Promise<Article> {
        return new Article();
    }

}
```

Depending on the incoming HTTP request's `Accept` header, a different method will be called:

- for `application/json`, `getArticleInJson` is called
- for `application/xml`, `getArticleInXml` is called
- for `application/json, application/xml`, `getArticleInJson` is called (the first match is used)
- for `application/json;q=0.2, application/xml`, `getArticleInXml` is called (`application/xml` has an implicit `q=1.0`)

The media range may also include wildcards, meaning `application/*` also matches the endpoint.

## Advanced Usage

The example above clearly feels like it has some redundant elements that could be stripped down. It could actually have been written using a single method:

```typescript
@Path('/articles')
class MyArticles {

    @GET @Path('/:articleId')
    @Produces('application/json', 'application/xml')
    async getArticleInJson(@PathParam('articleId') articleId: string): Promise<Article> {
        return new Article();
    }

}
```

Here the `@Produces` decorator states that both `application/json` and `application/xml` can be returned by the service.

Lower layers will take care of serializing the `Article` instance to either JSON or XML, based on the HTTP request's `Accept` header.

## Limitations

At the moment, there are a number of limitations when comparing to the complete HTTP specifications:

- `Accept-Encoding` and `Accept-Language` are ignored
- A media type's `charset` is ignored
