import { HttpContext } from './HttpContext';
import { HttpContextResolver } from './HttpContextResolver';
import { ClassConstructor } from '../utils';

const testHttpContextResolver: HttpContextResolver = <T>(itemClass: ClassConstructor<T>): T|undefined => {
    if (<Function> itemClass === String) {
        return 'test' as any as T;
    }

    return undefined;
};

describe('HTTP context', () => {
    let httpContext: HttpContext;

    beforeEach(() => {
        httpContext = new HttpContext(testHttpContextResolver);
    });

    it('can return a context item', () => {
        // when
        let item: String|undefined = httpContext.get(String);
        // then
        expect(item).toBe('test');
    });

    it('returns undefined for unknown item classes', () => {
        // when
        let item: Number|undefined = httpContext.get(Number);
        // then
        expect(item).toBeUndefined();
    });

});
