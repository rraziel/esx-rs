import {HttpUtils} from './http-utils';
import * as pathToRegexp from 'path-to-regexp';

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

    describe('can extract a path parameter value', () => {

        it('for a normal parameter', () => {
            // given
            let pathSpecificationKeys: pathToRegexp.Key[] = [];
            let pathSpecification: RegExp = pathToRegexp('/a/b/:test/c', pathSpecificationKeys);
            let path: string = '/a/b/value/c';
            let parameterName: string = 'test';
            // when
            let parameterValue: string = HttpUtils.getPathParameterValue(path, pathSpecification, pathSpecificationKeys, parameterName);
            // then
            expect(parameterValue).toEqual('value');
        });

        it('for a parameter at the end of the path', () => {
            // given
            let pathSpecificationKeys: pathToRegexp.Key[] = [];
            let pathSpecification: RegExp = pathToRegexp('/a/b/:test/c/:end', pathSpecificationKeys);
            let path: string = '/a/b/x/c/value';
            let parameterName: string = 'end';
            // when
            let parameterValue: string = HttpUtils.getPathParameterValue(path, pathSpecification, pathSpecificationKeys, parameterName);
            // then
            expect(parameterValue).toEqual('value');
        });

        it('returns undefined if the parameter is absent', () => {
            // given
            let pathSpecificationKeys: pathToRegexp.Key[] = [];
            let pathSpecification: RegExp = pathToRegexp('/a/b/c', pathSpecificationKeys);
            let path: string = '/a/b/c';
            let parameterName: string = 'test';
            // when
            let parameterValue: string = HttpUtils.getPathParameterValue(path, pathSpecification, pathSpecificationKeys, parameterName);
            // then
            expect(parameterValue).toBeUndefined();
        });

        it('returns undefined if the path does not match', () => {
            // given
            let pathSpecificationKeys: pathToRegexp.Key[] = [];
            let pathSpecification: RegExp = pathToRegexp('/a/b/c', pathSpecificationKeys);
            let path: string = '/x/y/z';
            let parameterName: string = 'test';
            // when
            let parameterValue: string = HttpUtils.getPathParameterValue(path, pathSpecification, pathSpecificationKeys, parameterName);
            // then
            expect(parameterValue).toBeUndefined();
        });

    });

});
