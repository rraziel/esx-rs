import {QueryParam} from './query-param';

describe('@QueryParam decorator', () => {

    describe('throws an exception when', () => {

        it('used on a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    static staticMethod(@QueryParam('test') x: string): void { /* empty */ }
                }
            }).toThrowError(/@QueryParam decorator cannot be used on a static method/);
        });

    });

});
