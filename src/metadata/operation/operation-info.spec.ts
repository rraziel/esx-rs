import {getFullOperationInfo, setOperationInfo, OperationInfo} from './operation-info';

describe('Operation information', () => {

    it('caches full information', () => {
        // given
        class Test { test() { /* empty */ } }
        let test: Test = new Test();
        let operationInfo: OperationInfo = {resourcePath: '/test'};
        // when
        setOperationInfo(Object.getPrototypeOf(test), 'test', operationInfo);
        let operationInfo1: OperationInfo = getFullOperationInfo(test, 'test');
        let operationInfo2: OperationInfo = getFullOperationInfo(test, 'test');
        // then
        expect(operationInfo1.resourcePathRegExp).toBe(operationInfo2.resourcePathRegExp);
    });

});
