import {HttpUtils} from './http-utils';

describe('HTTP utility functions', () => {

    describe('can extract a form parameter value', () => {

        it('for a normal parameter', () => {
            // given
            let body: string = 'a=1&b=2&test=value&c=3';
            let parameterName: string = 'test';
            // when
            let parameterValue: string = HttpUtils.getFormParameterValue(body, parameterName);
            // then
            expect(parameterValue).toEqual('value');
        });

        it('for an empty parameter', () => {
            // given
            let body: string = 'a=1&b=2&test=&c=3';
            let parameterName: string = 'test';
            // when
            let parameterValue: string = HttpUtils.getFormParameterValue(body, parameterName);
            // then
            expect(parameterValue).toEqual('');
        });

        it('returns undefined if the parameter is absent', () => {
            // given
            let body: string = 'a=1&b=2&c=3';
            let parameterName: string = 'test';
            // when
            let parameterValue: string = HttpUtils.getFormParameterValue(body, parameterName);
            // then
            expect(parameterValue).toBeUndefined();
        });

    });

});
