import { HttpResponseBuilder } from './HttpResponseBuilder';
import { HttpResponse } from './HttpResponse';

describe('HTTP response builder', () => {

    it('can set a status code', () => {
        // given
        let statusCode: number = 404;
        // when
        let httpResponse: HttpResponse = HttpResponseBuilder.of(statusCode).build();
        // then
        expect(httpResponse.getStatusCode()).toEqual(404);
    });

});
