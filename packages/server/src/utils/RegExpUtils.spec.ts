import { RegExpUtils } from './RegExpUtils';

describe('Regular expression utility functions', () => {

    it('can created a wildcard matching pattern', () => {
        // given
        let pattern: string = 'abc*ghi*nop';
        // when
        let regExp: RegExp = RegExpUtils.createWildcardRegExp(pattern);
        // then
        expect(regExp.test('abcdefghijklmnop')).toBe(true);
        expect(regExp.test('abcdghijklmnop')).toBe(true);
        expect(regExp.test('abcghijklmnop')).toBe(true);
        expect(regExp.test('abcghinop')).toBe(true);
    });

});
