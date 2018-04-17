import {HttpResponseBuilder} from './http-response-builder';
import {HttpResponse} from './http-response';

describe('HTTP response builder', () => {
    let builder: HttpResponseBuilder;

    beforeEach(() => {
        builder = new HttpResponseBuilder();
    });

    it('can set a status code', () => {
        // given
        let statusCode: number = 404;
        // when
        let httpResponse: HttpResponse = builder.withStatus(statusCode).build();
        // then
        expect(httpResponse.getStatusCode()).toEqual(404);
    });

});
