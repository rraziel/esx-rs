import {PathParam} from './path-param';

describe('@PathParam decorator', () => {

    describe('throws an exception when', () => {

        it('used on a static method', () => {
            // expect
            expect(() => {
                class TestClass {
                    static staticMethod(@PathParam('test') x: string): void { /* empty */ }
                }
            }).toThrowError(/@PathParam decorator cannot be used on a static method/);
        });

    });

});
