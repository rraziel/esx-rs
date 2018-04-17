import {getHttpMethodFromString, getStringFromHttpMethod, HttpMethod} from './http-method';

describe('HTTP method', () => {

    let recognizedMethods: string[] = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];

    recognizedMethods.forEach(recognizedMethod =>  it('can handle ' + recognizedMethod, () => {
        // when
        let httpMethod: HttpMethod = getHttpMethodFromString(recognizedMethod);
        let httpMethodString: string = getStringFromHttpMethod(httpMethod);
        // then
        expect(httpMethod).not.toBeUndefined();
        expect(httpMethodString).not.toBeUndefined();
        expect(httpMethodString).toEqual(recognizedMethod);
    }));

});
