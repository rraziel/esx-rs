import {HttpRequestMapper} from './http-request-mapper';
import {HttpRequest} from './http-request';
import {OperationInfo, OperationParameterInfo, OperationParameterType} from '../metadata';

describe('HTTP request mapper', () => {
    let httpRequestMapper: HttpRequestMapper;

    beforeEach(() => {
        httpRequestMapper = new HttpRequestMapper();
    });

    describe('can build an argument list from an HTTP request', () => {

        it('with no arguments', async () => {
            // given
            let operationInfo: OperationInfo = {};
            let httpRequest: HttpRequest = {method: 'POST', path: '/'};
            // when
            let operationArguments: any[] = await httpRequestMapper.buildArguments(operationInfo, httpRequest);
            // then
            expect(operationArguments).not.toBeUndefined();
            expect(operationArguments.length).toEqual(0);
        });

    });

});
