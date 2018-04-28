import {HttpContext} from './HttpContext';
import {HttpContextResolver} from './HttpContextResolver';
import {ClassConstructor} from 'es-decorator-utils';

class TestHttpContextResolver implements HttpContextResolver {
    resolve<T>(itemClass: ClassConstructor<T>): T {
        if (<Function> itemClass === String) {
            return <T><any> 'test';
        }

        return undefined;
    }
}

describe('HTTP context', () => {
    let httpContext: HttpContext;

    beforeEach(() => {
        httpContext = new HttpContext(new TestHttpContextResolver());
    });

    it('can return a context item', () => {
        // when
        let item: String = httpContext.get(String);
        // then
        expect(item).toEqual('test');
    });

    it('returns undefined for unknown item classes', () => {
        // when
        let item: Number = httpContext.get(Number);
        // then
        expect(item).toBeUndefined();
    });

});
